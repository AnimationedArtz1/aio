import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { Plan } from '@/types';
import { cn } from '@/lib/utils';

interface PricingSectionProps {
  plans: Plan[];
  onSelectPlan: (plan: Plan) => void;
  selectedPlanId?: string;
  className?: string;
}

const formatMessageLimit = (limit: number): string => {
  if (limit >= 1_000_000) return `${limit / 1_000_000}M`;
  if (limit >= 1_000) return `${limit / 1_000}K`;
  return String(limit);
};

const PricingSection: React.FC<PricingSectionProps> = ({ plans, onSelectPlan, selectedPlanId, className }) => {
  return (
    <section id="pricing" className={cn('space-y-12', className)}>
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">PLANLAR</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          İşletmenize göre ölçeklenen paketler
        </h2>
        <p className="text-slate-400">
          Başlangıç paketlerinden kurumsal ihtiyaçlara kadar tüm limitler şeffaf şekilde sunulur. İhtiyacınız olan
          planı seçip birkaç dakika içinde başvurunuzu tamamlayabilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => {
          const isSelected = plan.id === selectedPlanId;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'glass-panel rounded-3xl border border-white/10 p-6 flex flex-col h-full shadow-2xl shadow-black/20',
                (plan.highlight || isSelected) && 'border-electric-blue/50 bg-electric-blue/5'
              )}
            >
              {plan.highlight && (
                <span className="inline-flex items-center gap-1 text-xs text-electric-blue border border-electric-blue/40 bg-electric-blue/10 rounded-full px-3 py-1 mb-4 w-max">
                  <Sparkles size={14} /> Popüler seçim
                </span>
              )}
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="mt-6">
                <p className="text-4xl font-bold text-white">
                  ${plan.priceMonthly}
                  <span className="text-base text-slate-500 font-normal">/ay</span>
                </p>
                <p className="text-sm text-slate-400">{formatMessageLimit(plan.messageLimit)} mesaj limiti</p>
              </div>

              {plan.features && (
                <ul className="mt-6 space-y-3 text-sm text-slate-300 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <Button className="mt-8 w-full" onClick={() => onSelectPlan(plan)}>
                {isSelected ? 'Seçildi' : 'Paket seç'}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
