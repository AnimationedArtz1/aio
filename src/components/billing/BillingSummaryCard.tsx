import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BillingSummaryCardProps {
  totalCost: number;
  forecastCost: number;
  trendPercentage: number;
}

const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({
  totalCost,
  forecastCost,
  trendPercentage,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isTrendPositive = trendPercentage > 0;

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Billing Summary
      </h2>
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
        <div>
          <p className="text-sm text-slate-400 mb-1">Month-to-date cost</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">
              {formatCurrency(totalCost)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                'flex items-center text-sm font-medium',
                isTrendPositive ? 'text-rose-400' : 'text-emerald-400'
              )}
            >
              {isTrendPositive ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              {Math.abs(trendPercentage)}%
            </span>
            <span className="text-sm text-slate-500">from last month</span>
          </div>
        </div>

        <div className="w-px h-16 bg-white/10 hidden md:block" />

        <div>
          <p className="text-sm text-slate-400 mb-1">Forecasted this month</p>
          <span className="text-2xl font-semibold text-slate-200">
            {formatCurrency(forecastCost)}
          </span>
        </div>
        
        {/* Placeholder for optional sparkline or other metrics */}
        <div className="flex-1" /> 
      </div>
    </div>
  );
};

export default BillingSummaryCard;
