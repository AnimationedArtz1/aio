import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type {
  AgentConfig,
  BillingSummary,
  ChatResponse,
  CheckoutPayload,
  CheckoutResponse,
  CheckoutSessionResponse,
  PublicSignupPayload,
  PublicSignupResponse,
  SignupPayload,
  SignupResponse,
  TenantInfo,
  TenantProfile,
  TenantUsage,
} from '@/types';
import { DEFAULT_TENANT_SLUG, getActiveTenantSlug, getActiveTenantId } from '@/lib/tenantIdentity';

type EnhancedApiError = Error & { originalError?: AxiosError };

const normalizeUrl = (url?: string): string => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const getWebhookBaseUrl = (): string => {
  const envUrl = "https://n8n.aioasistan.com/webhook";
  if (!envUrl) {
    console.error('VITE_N8N_WEBHOOK_URL is not defined in environment variables.');
    return '';
  }
  return normalizeUrl(envUrl);
};

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) {
    console.warn('VITE_API_BASE_URL is not defined. Falling back to mock tenant data.');
    return '';
  }
  return normalizeUrl(envUrl);
};

const configureClient = (client: AxiosInstance) => {
  client.interceptors.request.use((config) => {
    const tenantSlug = getActiveTenantSlug();
    const tenantId = getActiveTenantId();

    if (import.meta.env.DEV && !tenantId) {
      console.warn(`[API] Request to ${config.url} missing tenantId!`);
    }

    config.headers = config.headers || {};
    
    if (tenantSlug) {
      config.headers['X-Tenant-Slug'] = tenantSlug;
    }
    
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      let message = 'An unexpected error occurred.';
      if (error.message === 'Network Error') {
        message = 'Connection failed. Please check your internet or server status.';
      } else if (error.response) {
        message = `Server Error: ${error.response.statusText} (${error.response.status})`;
      } else if (error.code === 'ECONNABORTED') {
        message = 'Request timed out.';
      }

      console.error('API Error:', error);
      const enhancedError: EnhancedApiError = new Error(message) as EnhancedApiError;
      enhancedError.originalError = error;
      return Promise.reject(enhancedError);
    }
  );

  return client;
};

const webhookApi = configureClient(
  axios.create({
    baseURL: getWebhookBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  })
);

const appApi = configureClient(
  axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  })
);

const fallbackTenantProfiles: Record<string, TenantProfile> = { 'aio-default': { tenant: { id: 'temp', slug: 'aio-default', name: 'Geçici Kullanıcı', plan_type: 'free', status: 'active' }, plan: { id: 'free', name: 'Free Plan', price: 0, currency: 'USD', interval: 'monthly', description: 'Basic access', features: [], highlight: false, limitSummary: '100 msgs' }, quotas: { monthlyMessages: 100, members: 1, storageGb: 1 }, branding: { accentColor: '#3b82f6' } } };

const fallbackTenantUsage: Record<string, TenantUsage> = {
  'aio-default': {
    messageCount: 420000,
    messageLimit: 1000000,
    agents: 24,
    agentLimit: 100,
    storageUsedGb: 120,
    storageLimitGb: 500,
    billingCycle: 'Mar 1 - Mar 31',
    renewsAt: '2025-03-31',
    creditsRemaining: 124500,
    lastSyncAt: new Date().toISOString(),
  },
  'kebapci-ahmet': {
    messageCount: 1200,
    messageLimit: 3000,
    agents: 1,
    agentLimit: 3,
    storageUsedGb: 1.2,
    storageLimitGb: 10,
    billingCycle: 'Mar 1 - Mar 31',
    renewsAt: '2025-03-31',
    creditsRemaining: 800,
    lastSyncAt: new Date().toISOString(),
  },
  'disci-ayse': {
    messageCount: 12000,
    messageLimit: 50000,
    agents: 5,
    agentLimit: 10,
    storageUsedGb: 12,
    storageLimitGb: 50,
    billingCycle: 'Mar 1 - Mar 31',
    renewsAt: '2025-03-31',
    creditsRemaining: 4800,
    lastSyncAt: new Date().toISOString(),
  },
};

const fallbackTenantsList: TenantInfo[] = Object.values(fallbackTenantProfiles).map((profile) => profile.tenant);

const resolveFallbackBillingSummary = (slug?: string): BillingSummary => {
  const resolvedSlug = slug && fallbackTenantProfiles[slug] ? slug : DEFAULT_TENANT_SLUG;
  const profile = fallbackTenantProfiles[resolvedSlug] ?? fallbackTenantProfiles[DEFAULT_TENANT_SLUG];
  const usage = fallbackTenantUsage[resolvedSlug] ?? fallbackTenantUsage[DEFAULT_TENANT_SLUG];
  const remaining = Math.max(0, usage.messageLimit - usage.messageCount);

  return {
    planName: profile?.plan.name ?? 'Demo Plan',
    remainingMessages: remaining,
    limitReached: remaining <= 0,
    message: remaining <= 0 ? 'Demo ortamında mesaj limitinize ulaştınız.' : undefined,
  };
};

const resolveFallbackProfile = (slug?: string): TenantProfile => {
  const resolvedSlug = slug && fallbackTenantProfiles[slug] ? slug : DEFAULT_TENANT_SLUG;
  return fallbackTenantProfiles[resolvedSlug];
};

const getFallbackTenantIdentity = () => {
  const slug = getActiveTenantSlug();
  const fallbackProfile = fallbackTenantProfiles[slug] ?? fallbackTenantProfiles[DEFAULT_TENANT_SLUG];
  return {
    tenantId: fallbackProfile.tenant.id,
    tenantSlug: slug,
  };
};

const resolveSlugFromTenantId = (tenantId?: string): string => {
  if (!tenantId) return DEFAULT_TENANT_SLUG;
  const match = Object.entries(fallbackTenantProfiles).find(
    ([, profile]) => profile.tenant.id === tenantId
  );
  return match?.[0] ?? DEFAULT_TENANT_SLUG;
};

export const agentService = {
  updateAgent: async (config: AgentConfig) => {
    const context = getFallbackTenantIdentity();
    const realTenantId = getActiveTenantId();
    const tenantId = realTenantId || context.tenantId;

    const response = await webhookApi.post('/update-agent', {
      ...config,
      tenant_id: tenantId,
      tenant_slug: context.tenantSlug,
    });
    return response.data;
  },
};

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const context = getFallbackTenantIdentity();
    const realTenantId = getActiveTenantId();
    const tenantId = realTenantId || context.tenantId;
    const defaultLimitMessage = 'Your message limit has been reached. Please upgrade your plan from the admin panel.';

    try {
      const response = await webhookApi.post<ChatResponse>('/chat', {
        message,
        tenant_id: tenantId,
        tenant_slug: context.tenantSlug,
      });

      const payload: ChatResponse =
        typeof response.data === 'string'
          ? { reply: response.data }
          : response.data;

      return {
        reply: payload.reply ?? 'No response content',
        limitReached: payload.limitReached ?? false,
        message: payload.message,
      };
    } catch (error) {
      const enhancedError = error as EnhancedApiError;
      const axiosError = enhancedError.originalError;
      if (axiosError?.response && [402, 403].includes(axiosError.response.status)) {
        const errorPayload = axiosError.response.data as ChatResponse | undefined;
        return {
          reply: '',
          limitReached: errorPayload?.limitReached ?? true,
          message: errorPayload?.message ?? enhancedError.message ?? defaultLimitMessage,
        };
      }

      throw error;
    }
  },
};

export const tenantService = {
  async getConfig(slug?: string): Promise<TenantProfile> {
    const resolvedSlug = slug || getActiveTenantSlug();
    if (!appApi.defaults.baseURL) {
      return resolveFallbackProfile(resolvedSlug);
    }

    try {
      const response = await appApi.get<TenantProfile>('/api/tenant/config', {
        params: { slug: resolvedSlug },
      });
      return response.data;
    } catch (error) {
      console.warn('Falling back to mock tenant config', error);
      return resolveFallbackProfile(resolvedSlug);
    }
  },

  async getUsage(tenantId?: string, tenantSlug?: string): Promise<TenantUsage> {
    const resolvedSlug = tenantSlug || resolveSlugFromTenantId(tenantId);
    if (!appApi.defaults.baseURL) {
      return fallbackTenantUsage[resolvedSlug] ?? fallbackTenantUsage[DEFAULT_TENANT_SLUG];
    }

    try {
      const response = await appApi.get<TenantUsage>('/api/tenant/usage', {
        params: { tenantId, slug: resolvedSlug },
      });
      return response.data;
    } catch (error) {
      console.warn('Falling back to mock tenant usage', error);
      return fallbackTenantUsage[resolvedSlug] ?? fallbackTenantUsage[DEFAULT_TENANT_SLUG];
    }
  },

  async listTenants(): Promise<TenantInfo[]> {
    if (!appApi.defaults.baseURL) {
      return fallbackTenantsList;
    }

    try {
      const response = await appApi.get<TenantInfo[]>('/api/tenant/list');
      return response.data;
    } catch (error) {
      console.warn('Falling back to mock tenant list', error);
      return fallbackTenantsList;
    }
  },
};

export const publicService = {
  async signup(payload: SignupPayload): Promise<SignupResponse> {
    if (!appApi.defaults.baseURL) {
      return {
        success: true,
        tenantSlug: payload.subdomain || DEFAULT_TENANT_SLUG,
        message: 'Demo mode signup completed.',
      };
    }

    const response = await appApi.post<SignupResponse>('/api/public/signup', payload);
    return response.data;
  },
};

// Backend is expected to expose GET /api/billing/summary to deliver plan and credit usage metadata.
export async function getBillingSummary(): Promise<BillingSummary> {
  const slug = getActiveTenantSlug();
  if (!appApi.defaults.baseURL) {
    return resolveFallbackBillingSummary(slug);
  }

  const response = await appApi.get<BillingSummary>('/api/billing/summary');
  return response.data;
}

export const billingService = {
  async startCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    if (!appApi.defaults.baseURL) {
      return {
        checkoutUrl: `/billing/checkout?plan=${payload.plan}`,
      };
    }

    const response = await appApi.post<CheckoutResponse>('/api/billing/checkout', payload);
    return response.data;
  },
  getSummary: getBillingSummary,
};

// Backend is expected to expose POST /public/signup for public onboarding payloads.
export async function signupTenant(payload: PublicSignupPayload): Promise<PublicSignupResponse> {
  if (!appApi.defaults.baseURL) {
    return {
      success: true,
      message: `Demo kaydı tamamlandı. Plan: ${payload.planId}`,
    };
  }

  const response = await appApi.post<PublicSignupResponse>('/public/signup', payload);
  return response.data;
}

// Backend is expected to expose POST /billing/checkout to initiate payment links for public signups.
export async function createCheckoutSession(planId: string): Promise<CheckoutSessionResponse> {
  if (!appApi.defaults.baseURL) {
    return {
      redirectUrl: `/billing/checkout?planId=${planId}`,
    };
  }

  const response = await appApi.post<CheckoutSessionResponse>('/billing/checkout', { planId });
  return response.data;
}

export default appApi;
