import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Mail, User, Download, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { publicPlans, getPlanById } from '@/lib/plans';

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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır');
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
    const content = `Giriş Bilgileriniz:
URL: ${window.location.origin}
Email: ${registrationData.tenant.email}
Şifre: ${formData.password}
Tarih: ${new Date().toLocaleString('tr-TR')}

(Lütfen bu dosyayı güvenli bir yerde saklayın.)`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aio-credentials.txt';
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
    <div className="min-h-screen bg-deep-space text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-deep-space/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            <span>Ana Sayfa</span>
          </button>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">
            AIO Asistan
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-electric-blue' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-electric-blue text-white' : 'bg-white/10'}`}>
              1
            </div>
            <span className="hidden sm:inline">Plan Seçimi</span>
          </div>
          <div className="w-12 h-0.5 bg-white/10" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-electric-blue' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-electric-blue text-white' : 'bg-white/10'}`}>
              2
            </div>
            <span className="hidden sm:inline">Bilgiler</span>
          </div>
          <div className="w-12 h-0.5 bg-white/10" />
          <div className="flex items-center gap-2 text-slate-500">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-white/10">
              3
            </div>
            <span className="hidden sm:inline">Ödeme</span>
          </div>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-center mb-8">Planınızı Seçin</h1>
            
            <div className="grid md:grid-cols-3 gap-6">
              {publicPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    plan.id === planId 
                      ? 'border-electric-blue bg-electric-blue/10 scale-105' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  {plan.highlight && (
                    <span className="inline-block text-xs bg-electric-blue/20 text-electric-blue px-2 py-1 rounded-full mb-3">
                      Popüler
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-3xl font-bold mt-2">
                    ${plan.priceMonthly}
                    <span className="text-sm text-slate-400 font-normal">/ay</span>
                  </p>
                  <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {plan.features?.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" onClick={() => setStep(2)}>
                {selectedPlan.name} ile Devam Et - ${selectedPlan.priceMonthly}/ay
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-center mb-2">İşletme Bilgileri</h1>
            <p className="text-slate-400 text-center mb-8">
              {selectedPlan.name} planı için kayıt olun
            </p>

            {/* Seçilen Plan Özeti */}
            <div className="bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 p-4 rounded-xl border border-white/10 mb-8 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-sm">Seçilen Plan:</span>
                <p className="text-lg font-bold">{selectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${selectedPlan.priceMonthly}</p>
                <span className="text-slate-400 text-sm">/ay</span>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="text-electric-blue text-sm hover:underline"
              >
                Değiştir
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 mb-2 text-slate-300">
                  <Building2 size={18} />
                  İşletme Adı *
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none transition"
                  placeholder="Örn: Lezzet Restoran"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-slate-300">
                  <User size={18} />
                  Şifre *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none transition"
                  placeholder="En az 6 karakter"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-slate-300">
                  <CheckCircle size={18} />
                  Şifre Tekrarı *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none transition"
                  placeholder="Şifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 text-slate-300">
                  <Mail size={18} />
                  E-posta Adresi *
                </label>
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white focus:border-electric-blue focus:outline-none transition"
                  placeholder="ornek@firma.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <p className="text-xs text-slate-500 mt-1">Giriş bilgileriniz bu adrese gönderilecek</p>
              </div>



              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 py-4 rounded-lg hover:bg-white/20 transition font-medium"
                >
                  Geri
                </button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  isLoading={loading}
                  >
                  Kayıt Ol
                </Button>
              </div>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              "Ödemeye Geç" butonuna tıklayarak{' '}
              <a href="/terms-of-service" className="text-electric-blue hover:underline">Hizmet Şartları</a>'nı
              ve{' '}
              <a href="/privacy-policy" className="text-electric-blue hover:underline">Gizlilik Politikası</a>'nı
              kabul etmiş olursunuz.
            </p>
          </motion.div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-deep-space border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex items-center justify-center mb-6">
                <CheckCircle size={48} className="text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Kayıt Başarılı!
              </h2>

              <p className="text-slate-400 text-center mb-6">
                İşletmeniz başarıyla oluşturuldu. AI asistanınızı kullanmaya başlamadan önce,
                aşağıdaki butonla giriş bilgilerinizi indirmenizi öneriyoruz.
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
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
                  className="w-full bg-white/10 py-4 rounded-lg hover:bg-white/20 transition font-medium text-white"
                >
                  Dashboard'a Devam Et
                </button>
              </div>

              <p className="text-center text-xs text-slate-500 mt-4">
                ⚠️ Giriş bilgilerinizi güvenli bir yerde saklayın
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Signup;
