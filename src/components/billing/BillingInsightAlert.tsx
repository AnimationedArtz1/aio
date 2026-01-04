import React from 'react';
import { Info, Bell } from 'lucide-react';

interface BillingInsightAlertProps {
  title?: string;
  message: string;
  onLearnMore?: () => void;
  onCreateAlert?: () => void;
}

const BillingInsightAlert: React.FC<BillingInsightAlertProps> = ({
  message,
  onLearnMore,
  onCreateAlert,
}) => {
  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-6">
      <div className="flex gap-3 items-start">
        <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
        <div>
           {/* <h4 className="font-medium text-blue-100 text-sm mb-1">{title}</h4> */}
          <p className="text-sm text-blue-200 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
      <div className="flex gap-3 shrink-0">
        <button 
            onClick={onLearnMore}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
            Learn more
        </button>
        {onCreateAlert && (
            <button 
                onClick={onCreateAlert}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
                <Bell size={14} />
                Create alert
            </button>
        )}
      </div>
    </div>
  );
};

export default BillingInsightAlert;
