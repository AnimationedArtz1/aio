import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { tenant, tenantProfile, availableTenants, switchTenant, isLoading } = useTenant();
  const tenantLabel = tenant?.name || tenant?.slug || '';

  return (
    <header className="h-20 px-6 glass-panel border-b border-white/[0.05] flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl bg-black/20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Search Bar (Visual Only) */}
        <div className="hidden md:flex items-center gap-3 bg-white/[0.03] border border-white/[0.05] rounded-full px-4 py-2 text-sm text-slate-400 w-64 focus-within:border-electric-blue/30 focus-within:bg-white/[0.05] transition-all">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Ara..." 
            className="bg-transparent border-none outline-none w-full placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Tenant Switcher */}
        <div className="hidden md:flex flex-col min-w-[220px]">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Aktif Müşteri</span>
          <select
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:ring-1 focus:ring-electric-blue/40"
            value={tenant?.slug || ''}
            onChange={(e) => switchTenant(e.target.value)}
            disabled={isLoading || availableTenants.length === 0}
          >
            {!tenant && (
              <option value="" disabled className="bg-slate-900 text-white">
                {isLoading ? 'Tenantlar yükleniyor...' : 'Tenant seçin'}
              </option>
            )}
            {availableTenants.map((item) => (
              <option key={item.id} value={item.slug} className="bg-slate-900 text-white">
                {item.name}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-slate-500 mt-1">
            {tenantLabel ? `Managing: ${tenantLabel}` : 'No tenant selected'}
          </span>
        </div>

        {/* System Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-400">Sistem Çevrimiçi</span>
        </div>

        <div className="hidden md:flex flex-col text-right">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Plan</span>
          <span className="text-sm font-semibold text-white">
            {tenantProfile?.plan.name || 'Belirsiz'}
          </span>
        </div>

        <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-electric-blue rounded-full border border-black"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-white">Mehmet Tutar</p>
            <p className="text-xs text-electric-blue font-medium">Yönetici</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-white font-bold shadow-inner">
            MT
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
