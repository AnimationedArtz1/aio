import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Insight } from '@/services/billing';

interface BillingInsightsCardProps {
  insights: Insight[];
}

const BillingInsightsCard: React.FC<BillingInsightsCardProps> = ({ insights }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 p-6 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="text-yellow-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Cost Insights</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-lg bg-white/5 p-4 border border-white/5">
            <p className="text-sm text-slate-300 mb-3">{insight.message}</p>
            {insight.actionLabel && (
              <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                {insight.actionLabel}
                <ArrowRight size={14} />
              </button>
            )}
             {insight.actionLink && !insight.actionLabel && (
              <a href={insight.actionLink} className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                Learn more
                <ArrowRight size={14} />
              </a>
            )}
          </div>
        ))}
        {insights.length === 0 && (
            <p className="text-sm text-slate-500">No insights available at this time.</p>
        )}
      </div>
    </div>
  );
};

export default BillingInsightsCard;
