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
  AlertCircle
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
    twilio_phone_number: string | null;
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
          <div className="text-slate-400">Yükleniyor...</div>
        </div>
      </DashboardLayout>
    );
  }

  const quotaPercentage = data?.quota 
    ? Math.round((data.quota.current_message_count / data.quota.monthly_message_limit) * 100)
    : 0;

  const phoneNumber = data?.agent?.twilio_phone_number || data?.tenant?.phone_number;
  const hasAgent = data?.agent && data.agent.system_prompt;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Hoş Geldin, {data?.tenant?.name || 'Kullanıcı'}
        </h1>
        <p className="text-slate-400">
          İşletmenizin AI asistanını buradan yönetebilirsiniz.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Phone Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Phone size={20} className="text-green-400" />
            </div>
            {phoneNumber ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Aktif</span>
            ) : (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Bekliyor</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-1">Telefon Numarası</p>
          <p className="text-lg font-mono text-white">
            {phoneNumber || 'Atanmadı'}
          </p>
        </motion.div>

        {/* Messages Used */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <MessageSquare size={20} className="text-blue-400" />
            </div>
            <span className="text-xs text-slate-500">{data?.quota?.plan_name?.toUpperCase()}</span>
          </div>
          <p className="text-sm text-slate-400 mb-1">Kullanılan Mesaj</p>
          <p className="text-lg font-bold text-white">
            {data?.quota?.current_message_count?.toLocaleString() || 0}
            <span className="text-sm font-normal text-slate-500"> / {data?.quota?.monthly_message_limit?.toLocaleString()}</span>
          </p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${quotaPercentage > 80 ? 'bg-red-500' : quotaPercentage > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
            />
          </div>
        </motion.div>

        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Bot size={20} className="text-purple-400" />
            </div>
            {hasAgent ? (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Yapılandırıldı</span>
            ) : (
              <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">Ayarla</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-1">AI Asistan</p>
          <p className="text-lg font-semibold text-white truncate">
            {data?.agent?.name || 'Yapılandırılmamış'}
          </p>
        </motion.div>

        {/* Today Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-cyan-400" />
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
          className="bg-white/5 rounded-xl border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Kurulum Durumu</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {phoneNumber ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <Clock size={20} className="text-yellow-400" />
              )}
              <span className={phoneNumber ? 'text-slate-300' : 'text-slate-400'}>
                Telefon numarası {phoneNumber ? 'atandı' : 'bekleniyor'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasAgent ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <AlertCircle size={20} className="text-orange-400" />
              )}
              <span className={hasAgent ? 'text-slate-300' : 'text-slate-400'}>
                AI Asistan {hasAgent ? 'yapılandırıldı' : 'yapılandırılmalı'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-slate-500" />
              <span className="text-slate-400">İlk test araması yapılmadı</span>
            </div>
          </div>

          {!hasAgent && (
            <Link 
              to="/dashboard/agent"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-electric-blue/20 text-electric-blue rounded-lg hover:bg-electric-blue/30 transition"
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
          className="bg-gradient-to-br from-electric-blue/10 to-neon-purple/10 rounded-xl border border-white/10 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Nasıl Çalışır?</h2>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue text-sm flex items-center justify-center">1</span>
              <div>
                <p className="text-white text-sm font-medium">Müşteri Arar</p>
                <p className="text-slate-400 text-xs">Size atanan numarayı müşteriniz arar</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue text-sm flex items-center justify-center">2</span>
              <div>
                <p className="text-white text-sm font-medium">AI Devreye Girer</p>
                <p className="text-slate-400 text-xs">Yapay zeka asistanınız müşteriyle konuşur</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue text-sm flex items-center justify-center">3</span>
              <div>
                <p className="text-white text-sm font-medium">Kayıt Tutulur</p>
                <p className="text-slate-400 text-xs">Tüm konuşmalar kaydedilir ve raporlanır</p>
              </div>
            </li>
          </ol>
        </motion.div>
      </div>

      {/* Agent Preview */}
      {data?.agent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">AI Asistan Önizleme</h2>
            <Link 
              to="/dashboard/agent"
              className="text-sm text-electric-blue hover:underline"
            >
              Düzenle
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Asistan Adı</p>
              <p className="text-white">{data.agent.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Model</p>
              <p className="text-white">{data.agent.model}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Telefon</p>
              <p className="text-white font-mono">{data.agent.twilio_phone_number || '-'}</p>
            </div>
          </div>
          {data.agent.system_prompt && (
            <div className="mt-4 p-3 bg-black/20 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Sistem Talimatı</p>
              <p className="text-sm text-slate-300 line-clamp-2">{data.agent.system_prompt}</p>
            </div>
          )}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
