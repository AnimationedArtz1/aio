import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Phone,
    Mail,
    Calendar,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { adminService, type TenantListItem } from '@/services/admin';

const AdminTenants: React.FC = () => {
    const [tenants, setTenants] = useState<TenantListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {
        const fetchTenants = async () => {
            setLoading(true);
            try {
                const data = await adminService.getTenants(page, limit, search);
                setTenants(data.tenants);
                setTotal(data.total);
            } catch (error) {
                console.error('Failed to fetch tenants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTenants();
    }, [page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to first page on search
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getPlanBadgeStyle = (plan: string) => {
        switch (plan) {
            case 'enterprise':
                return 'bg-neon-purple/15 text-neon-purple border-neon-purple/30';
            case 'pro':
                return 'bg-electric-blue/15 text-electric-blue border-electric-blue/30';
            default:
                return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
        }
    };

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
            case 'trialing':
                return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
            default:
                return 'bg-red-500/15 text-red-400 border-red-500/30';
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Users size={28} className="text-electric-blue" />
                    Müşteriler
                </h1>
                <p className="text-slate-400">
                    Sistemdeki tüm müşterileri görüntüleyin ve yönetin.
                </p>
            </div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="İsim veya e-posta ile ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 outline-none transition-all"
                    />
                </form>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/[0.06] overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent"
            >
                {loading ? (
                    <div className="p-8">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-white/[0.02] rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : tenants.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">Müşteri bulunamadı</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">ID</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Müşteri</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Plan</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Telefon</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Durum</th>
                                    <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Kayıt Tarihi</th>
                                    <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wide"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((tenant, index) => (
                                    <motion.tr
                                        key={tenant.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="p-4">
                                            <span className="text-slate-500 font-mono text-xs">{tenant.id}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-purple flex items-center justify-center text-white font-bold text-sm">
                                                    {tenant.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{tenant.name}</p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Mail size={12} />
                                                        {tenant.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getPlanBadgeStyle(tenant.plan_type)}`}>
                                                {tenant.plan_type.charAt(0).toUpperCase() + tenant.plan_type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {tenant.verimor_did ? (
                                                <span className="text-slate-300 font-mono text-sm flex items-center gap-1.5">
                                                    <Phone size={14} className="text-emerald-400" />
                                                    {tenant.verimor_did}
                                                </span>
                                            ) : (
                                                <span className="text-slate-500 text-sm">Atanmadı</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadgeStyle(tenant.status)}`}>
                                                {tenant.status === 'active' ? 'Aktif' : tenant.status === 'trialing' ? 'Deneme' : 'Askıda'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-slate-400 text-sm flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {formatDate(tenant.created_at)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors text-slate-400 hover:text-white">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Toplam {total} müşteri
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm text-slate-400 px-2">
                                {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminTenants;
