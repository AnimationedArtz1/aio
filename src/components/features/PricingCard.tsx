import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, ShoppingCart } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { Plan } from '@/types';
import { paynetService } from '@/services/paynet';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: Plan;
  highlight?: boolean;
  disabled?: boolean;
  onSuccess?: (sessionId: string) => void;
  className?: string;
}

const formatMessageLimit = (limit: number): string => {
  if (limit >= 1_000_000) return `${limit / 1_000_000}M`;
  if (limit >= 1_000) return `${limit / 1_000}K`;
  return String(limit);
};

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  highlight = false, 
  disabled = false,
  onSuccess,
  className 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await paynetService.createCheckoutSession({
        planId: plan.id as 'starter' | 'pro' | 'enterprise',
      });

      onSuccess?.(response.sessionId);
      
      paynetService.redirect(response.redirectUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ödeme başlatılamadı. Lütfen tekrar deneyin.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'glass-panel rounded-3xl border border-white/10 p-6 flex flex-col h-full shadow-2xl shadow-black/20 transition-all',
        highlight && 'border-electric-blue/50 bg-electric-blue/5',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {highlight && (
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

      <div className="mt-8 space-y-2">
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleBuy}
          isLoading={isLoading}
          disabled={isLoading || disabled}
        >
          <ShoppingCart size={20} className="mr-2" />
          Satın Al
        </Button>

        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}
      </div>
    </motion.div>
  );
};

export default PricingCard;
