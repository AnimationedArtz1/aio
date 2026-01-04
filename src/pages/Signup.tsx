import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Building2, Mail, Lock, Download, CheckCircle, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { publicPlans, getPlanById } from '@/lib/plans';

// Password strength calculation
const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 1) return { score, label: 'Zayıf', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Orta', color: 'bg-amber-500' };
  if (score <= 3) return { score, label: 'İyi', color: 'bg-yellow-500' };
  if (score <= 4) return { score, label: 'Güçlü', color: 'bg-emerald-500' };
  return { score, label: 'Çok Güçlü', color: 'bg-emerald-400' };
};

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('planId') || 'starter';
  const selectedPlan = getPlanById(planId);

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Plan Seçimi, 2: Bilgi Formu
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

  const handlePlanSelect = (id: string) => {
    navigate(`/signup?planId=${id}`);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.businessName || !formData.email || !formData.password) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      // Call new register endpoint (password-based, no payment)
      const res = await axios.post('/api/public/register', {
        businessName: formData.businessName,
        email: formData.email,
        password: formData.password
      });

      if (res.data.success) {
        // Store token and registration data
        localStorage.setItem('token', res.data.token);
        setRegistrationData(res.data);
        setShowSuccessModal(true);
        toast.success('Kayıt başarılı!');
      } else {
        toast.error('Kayıt başarısız');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      toast.error(err.response?.data?.error || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const downloadCredentials = () => {
    const content = `═══════════════════════════════════════════
    AIO ASISTAN - GİRİŞ BİLGİLERİNİZ
═══════════════════════════════════════════

URL: ${window.location.origin}
E-posta: ${registrationData.tenant.email}
Şifre: ${formData.password}

İşletme: ${registrationData.tenant.name}
Kayıt Tarihi: ${new Date().toLocaleString('tr-TR')}

═══════════════════════════════════════════
⚠️ Bu dosyayı güvenli bir yerde saklayın.
═══════════════════════════════════════════`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aio-giris-bilgileri.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Bilgiler indirildi!');
  };

  const goToDashboard = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-deep-space" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(139,92,246,0.08),transparent)]" />

      {/* Header */}
      <header className="relative border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Ana Sayfa</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">
              AIO Asistan
            </span>
          </div>
        </div>
      </header>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { num: 1, label: 'Plan Seçimi' },
            { num: 2, label: 'Bilgiler' },
            { num: 3, label: 'Ödeme' }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-electric-blue' : 'text-slate-500'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.num
                    ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/25'
                    : 'bg-white/[0.05] border border-white/[0.08]'
                  }`}>
                  {s.num}
                </div>
                <span className="hidden sm:inline font-medium">{s.label}</span>
              </div>
              {idx < 2 && <div className="w-12 h-0.5 bg-white/[0.08]" />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h1 className="text-3xl font-bold text-center mb-8">Planınızı Seçin</h1>

              <div className="grid md:grid-cols-3 gap-6">
                {publicPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4 }}
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${plan.id === planId
                        ? 'border-electric-blue/50 bg-electric-blue/10 ring-1 ring-electric-blue/30'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                      }`}
                  >
                    {plan.highlight && (
                      <span className="inline-flex items-center gap-1 text-xs bg-electric-blue/20 text-electric-blue px-2.5 py-1 rounded-full mb-3 border border-electric-blue/30">
                        <Sparkles size={12} />
                        Popüler
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-3xl font-bold mt-2 text-white">
                      ${plan.priceMonthly}
                      <span className="text-sm text-slate-400 font-normal">/ay</span>
                    </p>
                    <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {plan.features?.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-400" />
                          <span className="text-slate-300">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Button size="lg" onClick={() => setStep(2)} className="min-w-[280px]">
                  {selectedPlan.name} ile Devam Et
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-3xl font-bold text-center mb-2">İşletme Bilgileri</h1>
              <p className="text-slate-400 text-center mb-8">
                {selectedPlan.name} planı için kayıt olun
              </p>

              {/* Seçilen Plan Özeti */}
              <div className="bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 p-4 rounded-xl border border-white/[0.08] mb-8 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-sm">Seçilen Plan:</span>
                  <p className="text-lg font-bold text-white">{selectedPlan.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">${selectedPlan.priceMonthly}</p>
                  <span className="text-slate-400 text-sm">/ay</span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-electric-blue text-sm hover:underline"
                >
                  Değiştir
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-5">
                {/* Business Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Building2 size={16} />
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                    placeholder="Örn: Lezzet Restoran"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail size={16} />
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-4 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                    placeholder="ornek@firma.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  <p className="text-xs text-slate-500">Giriş bilgileriniz bu adrese gönderilecek</p>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <Lock size={16} />
                    Şifre * <span className="text-xs text-slate-500">(en az 8 karakter)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className="w-full bg-black/30 border border-white/[0.08] rounded-xl p-4 pr-12 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-1.5">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all ${level <= passwordStrength.score ? passwordStrength.color : 'bg-white/[0.08]'
                              }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs ${passwordStrength.color.replace('bg-', 'text-')}`}>
                        Şifre Gücü: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle size={16} />
                    Şifre Tekrarı *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      className={`w-full bg-black/30 border rounded-xl p-4 pr-12 text-white placeholder:text-slate-500 focus:ring-2 outline-none transition-all ${formData.confirmPassword && formData.confirmPassword !== formData.password
                          ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
                          : formData.confirmPassword && formData.confirmPassword === formData.password
                            ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20'
                            : 'border-white/[0.08] focus:border-electric-blue focus:ring-electric-blue/20'
                        }`}
                      placeholder="Şifrenizi tekrar girin"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                    <p className="text-xs text-red-400">Şifreler eşleşmiyor</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/[0.05] py-4 rounded-xl hover:bg-white/[0.08] transition font-medium border border-white/[0.08]"
                  >
                    Geri
                  </button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    isLoading={loading}
                    disabled={loading || formData.password !== formData.confirmPassword || formData.password.length < 8}
                  >
                    Kayıt Ol
                  </Button>
                </div>
              </form>

              <p className="text-center text-xs text-slate-500 mt-6">
                "Kayıt Ol" butonuna tıklayarak{' '}
                <a href="/terms-of-service" className="text-electric-blue hover:underline">Hizmet Şartları</a>'nı
                ve{' '}
                <a href="/privacy-policy" className="text-electric-blue hover:underline">Gizlilik Politikası</a>'nı
                kabul etmiş olursunuz.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-gradient-to-b from-surface-elevated to-surface border border-white/[0.08] rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-400" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-4">
                  Kayıt Başarılı! 🎉
                </h2>

                <p className="text-slate-400 text-center mb-6">
                  İşletmeniz başarıyla oluşturuldu. AI asistanınızı kullanmaya başlamadan önce,
                  aşağıdaki butonla giriş bilgilerinizi indirmenizi öneriyoruz.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="bg-white/[0.03] rounded-xl p-4 space-y-3 border border-white/[0.06]">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">İşletme:</span>
                      <span className="text-white font-medium">{registrationData?.tenant?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">E-posta:</span>
                      <span className="text-white font-medium">{registrationData?.tenant?.email}</span>
                    </div>
                    {registrationData?.phoneNumber && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Telefon:</span>
                        <span className="text-white font-mono">{registrationData.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={downloadCredentials}
                  >
                    <Download size={20} className="mr-2" />
                    Bilgilerimi İndir (.txt)
                  </Button>

                  <button
                    onClick={goToDashboard}
                    className="w-full bg-white/[0.05] py-4 rounded-xl hover:bg-white/[0.08] transition font-medium text-white border border-white/[0.08]"
                  >
                    Dashboard'a Devam Et
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5">
                  <span className="text-amber-400">⚠️</span>
                  Giriş bilgilerinizi güvenli bir yerde saklayın
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Signup;
