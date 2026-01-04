import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, Bot, X, LogOut, Layers, CreditCard, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Panel', path: '/admin' },
  { icon: Bot, label: 'Ajan Beyni', path: '/admin/agent-editor' },
  { icon: Layers, label: 'Planlar', path: '/admin/plans' },
  { icon: CreditCard, label: 'Faturalama', path: '/billing' },
  { icon: BarChart3, label: 'Kullanım', path: '/admin/usage' },
  { icon: Settings, label: 'Chatbot Ayarları', path: '/admin/widget-config' },
];

const SidebarContent: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="flex flex-col h-full text-slate-300">
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center shadow-lg shadow-electric-blue/20">
          <span className="font-bold text-white text-lg">A</span>
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight text-white">AIO V2.0</h1>
          <p className="text-xs text-slate-500 font-medium">Yönetim Paneli</p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    <nav className="flex-1 px-4 py-6 space-y-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/admin'}
          onClick={() => window.innerWidth < 1024 && onClose()}
          className={({ isActive }) => cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            isActive 
              ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
              : "hover:bg-white/[0.03] hover:text-white text-slate-400"
          )}
        >
          <item.icon size={20} className={cn("transition-transform group-hover:scale-110")} />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="p-4 mt-auto">
      <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group">
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Çıkış</span>
      </button>
    </div>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 glass-panel border-r border-white/[0.05] z-50">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 glass-panel border-r border-white/[0.05] z-50 lg:hidden"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
