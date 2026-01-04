import React from 'react';
import { TopService } from '@/services/billing';

interface BillingTopServicesProps {
  services: TopService[];
}

const BillingTopServices: React.FC<BillingTopServicesProps> = ({ services }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 p-6 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Top Services</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-slate-400 font-medium">Service</th>
              <th className="pb-3 text-right text-slate-400 font-medium">Cost</th>
              <th className="pb-3 text-right text-slate-400 font-medium">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {services.map((service, index) => (
              <tr key={index}>
                <td className="py-3 text-slate-200">{service.name}</td>
                <td className="py-3 text-right text-slate-200">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(service.cost)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={
                      service.change > 0
                        ? 'text-rose-400'
                        : service.change < 0
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }
                  >
                    {service.change > 0 ? '+' : ''}
                    {service.change}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
         <button className="text-sm text-blue-400 hover:text-blue-300">View all services</button>
      </div>
    </div>
  );
};

export default BillingTopServices;
