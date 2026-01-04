import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp, color = "text-electric-blue" }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
       <div className={cn("absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity", color)}>
          <Icon size={64} />
       </div>
       
       <div className="relative z-10">
          <div className={cn("w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4", color)}>
             <Icon size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs mt-2 font-medium", trendUp ? "text-emerald-400" : "text-red-400")}>
               <span>{trendUp ? "↑" : "↓"}</span>
               <span>{trend}</span>
               <span className="text-slate-500 ml-1">vs last month</span>
            </div>
          )}
       </div>
    </div>
  );
};

export default StatCard;
