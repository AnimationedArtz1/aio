import React from 'react';
import { TopProject } from '@/services/billing';

interface BillingTopProjectsProps {
  projects: TopProject[];
}

const BillingTopProjects: React.FC<BillingTopProjectsProps> = ({ projects }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1e293b]/50 p-6 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Top Projects</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-slate-400 font-medium">Project Name</th>
              <th className="pb-3 text-right text-slate-400 font-medium">Cost</th>
              <th className="pb-3 text-right text-slate-400 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((project, index) => (
              <tr key={index}>
                <td className="py-3 text-slate-200">
                  <div>{project.name}</div>
                  <div className="text-xs text-slate-500">{project.id}</div>
                </td>
                <td className="py-3 text-right text-slate-200 align-top">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(project.cost)}
                </td>
                <td className="py-3 text-right align-top">
                  <span className="text-slate-400">
                    {project.trend > 0 ? '+' : ''}
                    {project.trend}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
         <button className="text-sm text-blue-400 hover:text-blue-300">View all projects</button>
      </div>
    </div>
  );
};

export default BillingTopProjects;
