import React, { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import type { Plan, PublicSignupResponse } from '@/types';
import { createCheckoutSession, signupTenant } from '@/services/api';
import { CheckCircle2 } from 'lucide-react';

interface SignupFormProps {
  plan: Plan;
}

interface FormState {
  businessName: string;
  contactEmail: string;
  websiteUrl: string;
  industry: string;
  planId: string;
}

const industryOptions = [
  { value: '', label: 'Sektör seç (opsiyonel)' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'dentist', label: 'Diş Kliniği' },
  { value: 'retail', label: 'Perakende' },
  { value: 'agency', label: 'Ajans' },
  { value: 'other', label: 'Diğer' },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createInitialState = (planId: string): FormState => ({
  businessName: '',
  contactEmail: '',
  websiteUrl: '',
  industry: '',
  planId,
});

const SignupForm: React.FC<SignupFormProps> = ({ plan }) => {
  const [formState, setFormState] = useState<FormState>(() => createInitialState(plan.id));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'businessName' | 'contactEmail', string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<PublicSignupResponse | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    setFormState((prev) => ({ ...prev, planId: plan.id }));
    setFieldErrors({});
    setSubmitError(null);
    setSuccessState(null);
    setCheckoutError(null);
  }, [plan.id]);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field === 'businessName' || field === 'contactEmail') {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const errors: Partial<Record<'businessName' | 'contactEmail', string>> = {};

    if (!formState.businessName.trim()) {
      errors.businessName = 'İşletme adı zorunludur.';
    }

    if (!formState.contactEmail.trim() || !emailRegex.test(formState.contactEmail)) {
      errors.contactEmail = 'Geçerli bir email adresi girin.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        businessName: formState.businessName.trim(),
        contactEmail: formState.contactEmail.trim(),
        planId: formState.planId,
        websiteUrl: formState.websiteUrl.trim() || undefined,
        industry: formState.industry || undefined,
      };

      const response = await signupTenant(payload);

      if (!response.success) {
        setSubmitError(response.message || 'Kayıt tamamlanamadı. Lütfen tekrar deneyin.');
        return;
      }

      setSuccessState(response);
      setFormState(createInitialState(plan.id));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Kayıt tamamlanamadı. Lütfen tekrar deneyin.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckoutRedirect = async () => {
    setCheckoutError(null);
    setCheckoutLoading(true);

    try {
      const { redirectUrl } = await createCheckoutSession(plan.id);
      window.location.href = redirectUrl;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Ödeme bağlantısı oluşturulamadı.';
      setCheckoutError(message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handlePortalRedirect = () => {
    if (successState?.redirectUrl) {
      window.location.href = successState.redirectUrl;
    }
  };

  const successMessage = useMemo(() => {
    if (!successState?.success) return '';
    return successState.message || 'AIO paneliniz hazırlanıyor. Detayları email ile paylaşacağız.';
  }, [successState]);

  if (successState?.success) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-white">Başvurunuz alındı ✅</h3>
          <p className="text-slate-400">
            {successMessage}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {successState.redirectUrl ? (
            <Button size="lg" className="w-full sm:w-auto" onClick={handlePortalRedirect}>
              Panelime git
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full sm:w-auto"
              onClick={handleCheckoutRedirect}
              isLoading={checkoutLoading}
            >
              Ödeme adımına geç
            </Button>
          )}
          <Button
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              setSuccessState(null);
              setCheckoutError(null);
            }}
          >
            Yeni kayıt oluştur
          </Button>
        </div>
        {!successState.redirectUrl && checkoutError && (
          <p className="text-sm text-red-400">{checkoutError}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="planId" value={formState.planId} readOnly />
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="İşletme adı"
          placeholder="Örn. Kebapçı Ahmet"
          value={formState.businessName}
          onChange={(event) => handleChange('businessName', event.target.value)}
          error={fieldErrors.businessName}
          required
        />
        <Input
          label="İletişim emaili"
          placeholder="ornek@firma.com"
          type="email"
          value={formState.contactEmail}
          onChange={(event) => handleChange('contactEmail', event.target.value)}
          error={fieldErrors.contactEmail}
          required
        />
        <Input
          label="Website (opsiyonel)"
          placeholder="https://"
          value={formState.websiteUrl}
          onChange={(event) => handleChange('websiteUrl', event.target.value)}
        />
        <Select
          label="Sektör (opsiyonel)"
          value={formState.industry}
          onChange={(event) => handleChange('industry', event.target.value)}
          options={industryOptions}
        />
      </div>

      {submitError && <p className="text-sm text-red-400">{submitError}</p>}

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        Başvuruyu gönder
      </Button>
    </form>
  );
};

export default SignupForm;
