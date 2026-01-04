export type TenantSlug = string;

export interface AgentConfig {
  name: string;
  role_type: 'sales' | 'support' | 'general';
  model: 'gemini-pro' | 'gemini-flash';
  system_prompt: string;
  temperature: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatPayload {
  message: string;
}

export interface ChatResponse {
  reply?: string;
  limitReached?: boolean;
  message?: string;
}

export interface ChatLog {
  id: string;
  platform: string;
  userId: string;
  messagePreview: string;
  responsePreview: string;
  timestamp: string;
}

export interface DashboardStats {
  totalConversations: number;
  activeUsers: number;
  avgResponseTime: number;
}

export type PlanTier = 'starter' | 'pro' | 'enterprise';

export interface TenantInfo {
  id: string;
  name: string;
  slug: TenantSlug;
  plan_type: PlanTier;
  status: 'active' | 'trialing' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export interface PlanProduct {
  id: PlanTier;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  description: string;
  features: string[];
  highlight?: boolean;
  limitSummary: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  messageLimit: number;
  features?: string[];
  highlight?: boolean;
}

export type BillingProductType = 'plan' | 'credit_pack';

export interface BillingPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval?: 'monthly' | 'yearly' | 'one_time';
  type: BillingProductType;
  messageLimit?: number;
  creditAmount?: number;
  features?: string[];
  highlight?: boolean;
}

export interface TenantProfile {
  tenant: TenantInfo;
  plan: PlanProduct;
  quotas: {
    monthlyMessages: number;
    members: number;
    storageGb: number;
  };
  branding?: {
    accentColor?: string;
    logoUrl?: string;
  };
}

export interface TenantUsage {
  messageCount: number;
  messageLimit: number;
  agents: number;
  agentLimit: number;
  storageUsedGb: number;
  storageLimitGb: number;
  billingCycle: string;
  renewsAt: string;
  creditsRemaining: number;
  lastSyncAt?: string;
}

export interface BillingSummary {
  planName: string;
  remainingMessages: number;
  limitReached: boolean;
  message?: string;
}

export interface SignupPayload {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  plan: PlanTier;
  subdomain: string;
}

export interface SignupResponse {
  success: boolean;
  tenantSlug: TenantSlug;
  message?: string;
}

export interface PublicSignupPayload {
  businessName: string;
  contactEmail: string;
  websiteUrl?: string;
  industry?: string;
  planId: string;
}

export interface PublicSignupResponse {
  success: boolean;
  redirectUrl?: string;
  message?: string;
}

export interface CheckoutPayload {
  tenantId: string;
  plan: PlanTier;
  billingCycle?: 'monthly' | 'yearly';
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface BillingCheckoutPayload {
  planId?: string;
  creditPackId?: string;
}

export interface BillingCheckoutResponse {
  checkoutUrl: string;
}

export interface CheckoutSessionResponse {
  redirectUrl: string;
  checkoutUrl: string;
  sessionId: string;
}
