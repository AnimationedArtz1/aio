import appApi from '@/services/api';

export interface AdminStats {
    totalTenants: number;
    totalRevenue: number;
    activeTenants: number;
    newTenantsThisMonth: number;
}

export interface TenantListItem {
    id: string;
    name: string;
    email: string;
    plan_type: string;
    phone_number: string | null;
    verimor_did: string | null;
    status: 'active' | 'suspended' | 'trialing';
    created_at: string;
}

export interface TenantsResponse {
    tenants: TenantListItem[];
    total: number;
    page: number;
    limit: number;
}

export const adminService = {
    async getStats(): Promise<AdminStats> {
        const token = localStorage.getItem('token');
        const response = await appApi.get<AdminStats>('/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getTenants(page = 1, limit = 20, search = ''): Promise<TenantsResponse> {
        const token = localStorage.getItem('token');
        const response = await appApi.get<TenantsResponse>('/api/admin/tenants', {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit, search }
        });
        return response.data;
    },
};

export default adminService;
