import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, ArrowDown, ArrowUp, MessageSquare, Filter, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Call {
  id: string;
  from: string;
  to: string;
  duration: number;
  status: 'completed' | 'missed' | 'failed';
  timestamp: string;
  transcript?: string;
}

const CallsLog = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'missed'>('all');

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const token = localStorage.getItem('token');
        // Şimdilik mock data, sonra gerçek API'ye bağlanacak
        const mockCalls: Call[] = [
          {
            id: '1',
            from: '+90532100001',
            to: '+90555100122',
            duration: 125,
            status: 'completed',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            transcript: 'Müşteri randevu istedi...'
          },
          {
            id: '2',
            from: '+90532543001',
            to: '+90555100122',
            duration: 85,
            status: 'completed',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            from: '+90532100001',
            to: '+90555100122',
            duration: 0,
            status: 'missed',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
          },
        ];
        setCalls(mockCalls);
      } catch (err) {
        console.error('Aramalar yüklenemedi:', err);
        toast.error('Arama kayıtları yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const filteredCalls = filter === 'all' 
    ? calls 
    : calls.filter(call => call.status === filter);

  const totalDuration = calls.reduce((acc, call) => acc + call.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}dk ${secs}sn`;
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Arama Kayıtları</h1>
        <p className="text-slate-400">
          Gelen tüm aramaları buradan görebilir ve dinleyebilirsiniz.
        </p>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-6 bg-white/5 rounded-xl p-2"
      >
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all' 
              ? 'bg-electric-blue text-white' 
              : 'text-slate-400 hover:bg-white/10'
          }`}
        >
          Tümü ({calls.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'completed' 
              ? 'bg-green-500/20 text-green-400' 
              : 'text-slate-400 hover:bg-white/10'
          }`}
        >
          Tamamlanan ({calls.filter(c => c.status === 'completed').length})
        </button>
        <button
          onClick={() => setFilter('missed')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'missed' 
              ? 'bg-red-500/20 text-red-400' 
              : 'text-slate-400 hover:bg-white/10'
          }`}
        >
          Cevapsız ({calls.filter(c => c.status === 'missed').length})
        </button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Toplam Arama</p>
              <p className="text-2xl font-bold text-white">{calls.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Phone size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tamamlanan</p>
              <p className="text-2xl font-bold text-white">{calls.filter(c => c.status === 'completed').length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ArrowUp size={20} className="text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Toplam Süre</p>
              <p className="text-lg font-bold text-white">{formatDuration(totalDuration)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clock size={20} className="text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calls List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
      >
        {filteredCalls.length === 0 ? (
          <div className="p-12 text-center">
            <Phone size={48} className="mx-auto mb-4 text-slate-600" />
            <p className="text-slate-400">Henüz arama kaydı yok</p>
            <p className="text-sm text-slate-500 mt-2">
              İlk aramalar burada görüntülenecek
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Zaman
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Arayan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Süre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredCalls.map((call, index) => (
                  <motion.tr
                    key={call.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500" />
                        {formatTime(call.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white font-mono">{call.from}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        call.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : call.status === 'missed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {call.status === 'completed' && <ArrowDown size={12} />}
                        {call.status === 'missed' && <ArrowUp size={12} />}
                        {call.status === 'completed' ? 'Cevaplandı' : call.status === 'missed' ? 'Cevapsız' : 'Başarısız'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {call.duration > 0 ? formatDuration(call.duration) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {call.transcript ? (
                        <button className="text-electric-blue hover:underline flex items-center gap-1 text-sm">
                          <MessageSquare size={14} />
                          Dinle
                        </button>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-slate-300 rounded-lg hover:bg-white/20 transition">
          <Filter size={16} />
          <span>Dışa Aktar (CSV)</span>
        </button>
      </div>
    </DashboardLayout>
  );
};

export default CallsLog;
