import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState<any>(null);
  const [isFinalizing, setIsFinalizing] = useState(true);

  useEffect(() => {
    const finalizeAccount = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        const data = localStorage.getItem('pendingSignup');
        if (data) {
          setSignupData(JSON.parse(data));
          localStorage.removeItem('pendingSignup');
        }
      } finally {
        setIsFinalizing(false);
      }
    };

    finalizeAccount();
  }, []);

  if (isFinalizing) {
    return (
      <div className="min-h-screen bg-deep-space text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-electric-blue/20 flex items-center justify-center"
          >
            <Loader2 size={48} className="text-electric-blue" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-4">Hesabınız Hazırlanıyor...</h1>
          <p className="text-slate-400">
            Ödemeniz başarıyla alındı. AI Asistan hesabınız oluşturuluyor, lütfen bekleyin.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-space text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle size={48} className="text-green-400" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Ödeme Başarılı!</h1>
        <p className="text-slate-400 mb-8">
          Tebrikler! AI Asistan hesabınız oluşturuldu.
        </p>

        {/* Bilgi Kartları */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 text-left space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-electric-blue/20 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-electric-blue" />
            </div>
            <div>
              <h3 className="font-semibold">Giriş Bilgileriniz</h3>
              <p className="text-sm text-slate-400">
                E-posta adresinize ({signupData?.email || 'kayıtlı email'}) giriş bilgileriniz gönderildi.
                Geçici şifrenizi kullanarak giriş yapabilirsiniz.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
              <Phone size={20} className="text-neon-purple" />
            </div>
            <div>
              <h3 className="font-semibold">Telefon Numaranız</h3>
              <p className="text-sm text-slate-400">
                Size özel bir telefon numarası atandı. Dashboard'dan numaranızı görebilir ve
                AI Asistanınızı yapılandırabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-electric-blue/10 to-neon-purple/10 rounded-xl p-4 mb-8 text-left">
          <h3 className="font-semibold mb-2">Sonraki Adımlar:</h3>
          <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
            <li>E-postanızı kontrol edin</li>
            <li>Geçici şifrenizle giriş yapın</li>
            <li>AI Asistanınızın promptunu özelleştirin</li>
            <li>Test araması yapın</li>
          </ol>
        </div>

        <Button size="lg" onClick={() => navigate('/login')} className="w-full">
          Giriş Yap
          <ArrowRight size={20} className="ml-2" />
        </Button>

        <p className="text-xs text-slate-500 mt-6">
          Sorularınız için:{' '}
          <a href="mailto:destek@aioasistan.com" className="text-electric-blue hover:underline">
            destek@aioasistan.com
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
