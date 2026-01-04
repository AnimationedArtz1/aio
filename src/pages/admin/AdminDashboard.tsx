import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    DollarSign,
    TrendingUp,
    UserPlus,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { adminService, type AdminStats } from '@/services/admin';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Toplam Müşteri',
            value: stats?.totalTenants || 0,
            icon: Users,
            color: 'electric-blue',
            bgColor: 'bg-electric-blue/15',
            textColor: 'text-electric-blue',
        },
        {
            title: 'Toplam Gelir',
            value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'emerald',
            bgColor: 'bg-emerald-500/15',
            textColor: 'text-emerald-400',
        },
        {
            title: 'Aktif Müşteriler',
            value: stats?.activeTenants || 0,
            icon: Activity,
            color: 'neon-purple',
            bgColor: 'bg-neon-purple/15',
            textColor: 'text-neon-purple',
        },
        {
            title: 'Bu Ay Yeni',
            value: stats?.newTenantsThisMonth || 0,
            icon: UserPlus,
            color: 'cyan',
            bgColor: 'bg-cyan-500/15',
            textColor: 'text-cyan-400',
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400">
                    Sistem genelindeki istatistikleri ve müşteri durumunu görüntüleyin.
                </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.06] animate-pulse">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.05] mb-4" />
                            <div className="h-4 w-24 bg-white/[0.05] rounded mb-2" />
                            <div className="h-8 w-16 bg-white/[0.05] rounded" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative rounded-2xl p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.1] transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <card.icon size={24} className={card.textColor} />
                                </div>
                                <ArrowUpRight size={16} className="text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-sm text-slate-400 mb-1">{card.title}</p>
                            <p className="text-2xl font-bold text-white">{card.value}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06]"
                >
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-electric-blue" />
                        Hızlı İşlemler
                    </h2>
                    <div className="space-y-3">
                        <a
                            href="/admin/tenants"
                            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <Users size={20} className="text-slate-400 group-hover:text-electric-blue transition-colors" />
                                <span className="text-slate-300 group-hover:text-white transition-colors">Tüm Müşterileri Görüntüle</span>
                            </div>
                            <ArrowUpRight size={16} className="text-slate-500 group-hover:text-electric-blue transition-colors" />
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl p-6 bg-gradient-to-br from-electric-blue/5 to-neon-purple/5 border border-white/[0.06]"
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Sistem Durumu</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">API Durumu</span>
                            <span className="flex items-center gap-2 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Aktif
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Verimor Bağlantısı</span>
                            <span className="flex items-center gap-2 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Aktif
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Paynet Bağlantısı</span>
                            <span className="flex items-center gap-2 text-emerald-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Aktif
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
