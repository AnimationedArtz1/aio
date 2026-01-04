import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { path: '/admin/tenants', icon: Users, label: 'Müşteriler' },
  { path: '/admin/settings', icon: Settings, label: 'Ayarlar' },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-deep-space">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_-20%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-pink-500 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">Admin Panel</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 z-50',
        'bg-gradient-to-b from-surface to-surface-elevated',
        'border-r border-neon-purple/20',
        'transform transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-pink-500 flex items-center justify-center shadow-lg shadow-neon-purple/25">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-neon-purple">Sistem Yönetimi</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="px-4 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Müşteri Paneline Dön
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            {adminMenuItems.map((item) => {
              const isActive = item.end
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-neon-purple/15 text-neon-purple border border-neon-purple/25'
                      : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                  )}
                >
                  <item.icon size={20} className={cn(
                    'transition-transform duration-200',
                    isActive ? '' : 'group-hover:scale-110'
                  )} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-neon-purple">Sistem Yöneticisi</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
            >
              <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0 relative">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
