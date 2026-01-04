import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface BillingBudgetCardProps {
  currentCost: number;
  forecastCost: number;
  budgetAlert: boolean;
}

const BillingBudgetCard: React.FC<BillingBudgetCardProps> = ({
  currentCost,
  forecastCost,
  budgetAlert,
}) => {
  // Mock budget limit for visualization
  const budgetLimit = 2000;
  const percentage = Math.min((currentCost / budgetLimit) * 100, 100);
  const forecastPercentage = Math.min((forecastCost / budgetLimit) * 100, 100);

  return (
    <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 p-6 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Budget & Alerts</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm text-slate-400">Monthly Budget</span>
            <span className="text-sm font-medium text-slate-200">
               {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(budgetLimit)}
            </span>
          </div>
          
          <div className="relative h-4 w-full bg-slate-700 rounded-full overflow-hidden">
             {/* Forecast bar (background) */}
             <div 
                className="absolute top-0 left-0 h-full bg-slate-600/50" 
                style={{ width: `${forecastPercentage}%` }}
             />
             {/* Current cost bar */}
            <div
              className={`absolute top-0 left-0 h-full rounded-full ${
                budgetAlert ? 'bg-rose-500' : 'bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>{percentage.toFixed(0)}% used</span>
            <span>Forecast: {forecastPercentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="rounded-lg bg-white/5 p-4 border border-white/5 flex items-start gap-3">
            {budgetAlert ? (
                <AlertTriangle className="text-rose-400 shrink-0" size={20} />
            ) : (
                <CheckCircle className="text-emerald-400 shrink-0" size={20} />
            )}
            <div>
                <p className={`text-sm font-medium ${budgetAlert ? 'text-rose-200' : 'text-emerald-200'}`}>
                    {budgetAlert ? 'Budget threshold exceeded' : 'Within budget'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                    {budgetAlert 
                        ? 'Your forecasted cost is higher than your alert threshold.'
                        : 'Your costs are trending within your monthly budget.'}
                </p>
            </div>
        </div>
        
        <button className="text-sm text-blue-400 hover:text-blue-300 w-full text-left">
            Manage budgets
        </button>
      </div>
    </div>
  );
};

export default BillingBudgetCard;
