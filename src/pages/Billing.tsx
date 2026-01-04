import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, AlertCircle, Info } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PricingCard from '@/components/features/PricingCard';
import { publicPlans } from '@/lib/plans';
import { getBillingSummary } from '@/services/api';
import type { BillingSummary } from '@/types';

const Billing = () => {
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingSummary = async () => {
      try {
        const summary = await getBillingSummary();
        setBillingSummary(summary);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Faturalandırma bilgileri yüklenemedi.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingSummary();
  }, []);

  const handlePlanPurchase = (sessionId: string) => {
    localStorage.setItem('checkoutSessionId', sessionId);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Faturalandırma</h1>
          <p className="text-slate-400">
            Mevcut planınızı görün ve işletmenizin ihtiyaçlarına göre yükseltin.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Yükleniyor...</div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Hata</p>
              <p className="text-slate-300 text-sm">{error}</p>
            </div>
          </div>
        ) : billingSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 flex items-center justify-center">
                  <CreditCard size={24} className="text-electric-blue" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Mevcut Plan</h2>
                  <p className="text-slate-400 text-sm">{billingSummary.planName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                    <TrendingUp size={16} />
                    <span>Kalan Mesaj</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {billingSummary.remainingMessages.toLocaleString()}
                  </p>
                </div>

                {billingSummary.limitReached && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
                      <AlertCircle size={16} />
                      <span>Durum</span>
                    </div>
                    <p className="text-sm text-amber-400">
                      {billingSummary.message || 'Mesaj limitinize ulaştınız.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-electric-blue/20 flex items-center justify-center">
                  <Info size={20} className="text-electric-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Plan Yükseltme</h3>
                  <p className="text-slate-400 text-sm">
                    İşletmenizin ihtiyaçlarına uygun planı seçin ve anında yükseltin.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publicPlans.map((plan) => {
                  const isCurrentPlan = plan.name === billingSummary.planName;
                  return (
                    <PricingCard
                      key={plan.id}
                      plan={plan}
                      highlight={plan.highlight}
                      disabled={isCurrentPlan}
                      onSuccess={handlePlanPurchase}
                      className={isCurrentPlan ? 'opacity-60' : ''}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Billing;
