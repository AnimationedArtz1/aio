import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  Bot,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface DashboardData {
  tenant: {
    name: string;
    email: string;
    phone_number: string | null;
    slug: string;
  };
  quota: {
    plan_name: string;
    monthly_message_limit: number;
    current_message_count: number;
  };
  agent: {
    name: string;
    model: string;
    verimor_did: string | null;
    system_prompt: string;
  } | null;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Dashboard veri hatası:', err);
        toast.error('Veriler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-5 h-5 border-2 border-electric-blue/30 border-t-electric-blue rounded-full animate-spin" />
            <span>Yükleniyor...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const quotaPercentage = data?.quota
    ? Math.round((data.quota.current_message_count / data.quota.monthly_message_limit) * 100)
    : 0;

  // Use verimor_did from agent, fallback to tenant phone_number
  const phoneNumber = data?.agent?.verimor_did || data?.tenant?.phone_number;
  const hasAgent = data?.agent && data.agent.system_prompt;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
            Hoş Geldin, <span className="bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-neon-purple">{data?.tenant?.name || 'Kullanıcı'}</span>
          </h1>
          <p className="text-slate-400">
            İşletmenizin AI asistanını buradan yönetebilirsiniz.
          </p>
        </motion.div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Phone Status */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.1] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={22} className="text-emerald-400" />
            </div>
            {phoneNumber ? (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">Aktif</span>
            ) : (
              <span className="text-xs bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">Bekliyor</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-1">Verimor Numarası</p>
          <p className="text-lg font-mono text-white">
            {phoneNumber || 'Atanmadı'}
          </p>
        </motion.div>

        {/* Messages Used */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.1] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-electric-blue/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare size={22} className="text-electric-blue" />
            </div>
            <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{data?.quota?.plan_name}</span>
          </div>
          <p className="text-sm text-slate-400 mb-1">Kullanılan Mesaj</p>
          <p className="text-lg font-bold text-white">
            {data?.quota?.current_message_count?.toLocaleString() || 0}
            <span className="text-sm font-normal text-slate-500"> / {data?.quota?.monthly_message_limit?.toLocaleString()}</span>
          </p>
          <div className="mt-3 h-2 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(quotaPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${quotaPercentage > 80 ? 'bg-red-500' : quotaPercentage > 50 ? 'bg-amber-500' : 'bg-electric-blue'}`}
            />
          </div>
        </motion.div>

        {/* Agent Status */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.1] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-neon-purple/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot size={22} className="text-neon-purple" />
            </div>
            {hasAgent ? (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">Yapılandırıldı</span>
            ) : (
              <span className="text-xs bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">Ayarla</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-1">AI Asistan</p>
          <p className="text-lg font-semibold text-white truncate">
            {data?.agent?.name || 'Yapılandırılmamış'}
          </p>
        </motion.div>

        {/* Today Calls */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className="group relative rounded-2xl p-5 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.1] transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={22} className="text-cyan-400" />
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">Bugünkü Aramalar</p>
          <p className="text-lg font-bold text-white">0</p>
          <p className="text-xs text-slate-500 mt-1">Henüz arama yok</p>
        </motion.div>
      </div>

      {/* Quick Actions & Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Setup Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]"
        >
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-electric-blue" />
            Kurulum Durumu
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {phoneNumber ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center">
                  <Clock size={16} className="text-amber-400" />
                </div>
              )}
              <span className={phoneNumber ? 'text-slate-300' : 'text-slate-400'}>
                Telefon numarası {phoneNumber ? 'atandı' : 'bekleniyor'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasAgent ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/15 flex items-center justify-center">
                  <AlertCircle size={16} className="text-amber-400" />
                </div>
              )}
              <span className={hasAgent ? 'text-slate-300' : 'text-slate-400'}>
                AI Asistan {hasAgent ? 'yapılandırıldı' : 'yapılandırılmalı'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center">
                <Clock size={16} className="text-slate-500" />
              </div>
              <span className="text-slate-400">İlk test araması yapılmadı</span>
            </div>
          </div>

          {!hasAgent && (
            <Link
              to="/dashboard/agent"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-electric-blue/10 text-electric-blue rounded-xl hover:bg-electric-blue/15 border border-electric-blue/20 transition-all font-medium"
            >
              AI Asistanı Yapılandır
              <ArrowRight size={18} />
            </Link>
          )}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6 bg-gradient-to-br from-electric-blue/5 to-neon-purple/5 border border-white/[0.06]"
        >
          <h2 className="text-lg font-semibold text-white mb-5">Nasıl Çalışır?</h2>
          <ol className="space-y-5">
            {[
              { step: 1, title: 'Müşteri Arar', desc: 'Size atanan numarayı müşteriniz arar' },
              { step: 2, title: 'AI Devreye Girer', desc: 'Yapay zeka asistanınız müşteriyle konuşur' },
              { step: 3, title: 'Kayıt Tutulur', desc: 'Tüm konuşmalar kaydedilir ve raporlanır' },
            ].map((item, idx) => (
              <motion.li
                key={item.step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-electric-blue/15 text-electric-blue text-sm font-medium flex items-center justify-center border border-electric-blue/20">
                  {item.step}
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{item.title}</p>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>

      {/* Agent Preview */}
      {data?.agent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bot size={20} className="text-neon-purple" />
              AI Asistan Önizleme
            </h2>
            <Link
              to="/dashboard/agent"
              className="text-sm text-electric-blue hover:text-electric-blue/80 font-medium transition-colors"
            >
              Düzenle
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 mb-1.5">Asistan Adı</p>
              <p className="text-white font-medium">{data.agent.name}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 mb-1.5">Model</p>
              <p className="text-white font-medium">{data.agent.model}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-xs text-slate-500 mb-1.5">Verimor Telefon</p>
              <p className="text-white font-mono">{data.agent.verimor_did || '-'}</p>
            </div>
          </div>
          {data.agent.system_prompt && (
            <div className="mt-4 p-4 rounded-xl bg-black/20 border border-white/[0.04]">
              <p className="text-xs text-slate-500 mb-1.5">Sistem Talimatı</p>
              <p className="text-sm text-slate-300 line-clamp-2">{data.agent.system_prompt}</p>
            </div>
          )}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
