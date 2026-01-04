import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, MessageCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const errorType: 'payment' | 'rate_limit' | 'generic' = (() => {
    const error = searchParams.get('error');
    if (error === 'rate_limit_exceeded') {
      return 'rate_limit';
    }
    return 'generic';
  })();

  const errorMessage = searchParams.get('error_detail');

  return (
    <div className="min-h-screen bg-deep-space text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full text-center"
      >
        {/* Fail Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/20 flex items-center justify-center"
        >
          <XCircle size={48} className="text-red-400" />
        </motion.div>

        {errorType === 'rate_limit' ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Çok Fazla Deneme</h1>
            <p className="text-slate-400 mb-8">
              {errorMessage || 'Lütfen biraz bekledikten sonra tekrar deneyin.'}
            </p>

            <div className="bg-amber-500/10 rounded-2xl border border-amber-500/30 p-6 mb-8 text-left">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-400 mb-1">Güvenlik Limiti</h3>
                  <p className="text-sm text-slate-300">
                    Güvenliğiniz için ödeme başlatma işlemleri sınırlandırılmıştır. 1 dakika bekledikten sonra tekrar deneyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Ana Sayfaya Dön
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-4">Ödeme Başarısız</h1>
            <p className="text-slate-400 mb-8">
              Maalesef ödeme işlemi tamamlanamadı. Bu birkaç nedenden kaynaklanmış olabilir.
            </p>

            {errorMessage && (
              <div className="bg-red-500/10 rounded-2xl border border-red-500/30 p-4 mb-8 text-left">
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">Olası Nedenler:</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Kart limiti yetersiz olabilir
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Kart bilgileri hatalı girilmiş olabilir
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  Bankanız işlemi reddetmiş olabilir
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  3D Secure doğrulaması başarısız olmuş olabilir
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')} 
                className="w-full"
              >
                <RefreshCw size={20} className="mr-2" />
                Tekrar Dene
              </Button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                Ana Sayfaya Dön
              </button>
            </div>
          </>
        )}

        <div className="mt-8 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <MessageCircle size={18} />
            <span className="text-sm">Yardıma mı ihtiyacınız var?</span>
          </div>
          <a 
            href="mailto:destek@aioasistan.com" 
            className="text-electric-blue hover:underline text-sm"
          >
            destek@aioasistan.com
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFail;
