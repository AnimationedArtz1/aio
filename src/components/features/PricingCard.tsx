import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, ShoppingCart, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { Plan } from '@/types';
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
  const navigate = useNavigate();

  const handleBuy = () => {
    if (disabled) return;
    // Signup sayfasına yönlendir, planId ile
    navigate(`/signup?planId=${plan.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative group rounded-2xl p-6 flex flex-col h-full transition-all duration-300',
        'bg-gradient-to-b from-white/[0.04] to-white/[0.01]',
        'backdrop-blur-xl border',
        highlight
          ? 'border-electric-blue/40 shadow-glow-blue'
          : 'border-white/[0.08] hover:border-white/[0.15]',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
        highlight
          ? 'bg-gradient-to-br from-electric-blue/5 to-neon-purple/5'
          : 'bg-gradient-to-br from-white/[0.02] to-transparent'
      )} />

      {/* Highlight badge */}
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-r from-electric-blue to-neon-purple px-4 py-1.5 rounded-full shadow-lg shadow-electric-blue/25">
            <Sparkles size={12} className="animate-pulse" />
            Popüler seçim
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        {/* Plan Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              highlight
                ? 'bg-gradient-to-br from-electric-blue to-neon-purple'
                : 'bg-white/[0.06]'
            )}>
              <Zap size={20} className={highlight ? 'text-white' : 'text-electric-blue'} />
            </div>
            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">${plan.priceMonthly}</span>
            <span className="text-slate-500">/ay</span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            <span className="text-electric-blue font-medium">{formatMessageLimit(plan.messageLimit)}</span> mesaj limiti
          </p>
        </div>

        {/* Features */}
        {plan.features && (
          <ul className="space-y-3 flex-1 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} className="text-emerald-400" />
                </div>
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA Button */}
        <div className="mt-auto">
          <Button
            size="lg"
            className={cn(
              'w-full relative overflow-hidden',
              highlight && 'shadow-lg shadow-electric-blue/20'
            )}
            variant={highlight ? 'primary' : 'secondary'}
            onClick={handleBuy}
            disabled={disabled}
          >
            <ShoppingCart size={18} className="mr-2" />
            {disabled ? 'Mevcut Plan' : 'Satın Al'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingCard;
