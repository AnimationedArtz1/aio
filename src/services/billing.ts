import appApi from '@/services/api';
import { publicPlans } from '@/lib/plans';
import type { BillingCheckoutPayload, BillingCheckoutResponse, BillingPlan } from '@/types';

// New Types for Dashboard
export interface DailyCost {
  date: string;
  cost: number;
}

export interface TopService {
  name: string;
  cost: number;
  change: number; // percentage
}

export interface TopProject {
  name: string;
  id: string;
  cost: number;
  trend: number; // percentage
}

export interface Insight {
  id: string;
  type: 'info' | 'warning' | 'suggestion';
  message: string;
  actionLabel?: string;
  actionLink?: string;
}

export interface BillingDashboardData {
  totalCost: number;
  previousMonthCost: number;
  forecastCost: number;
  trendPercentage: number;
  topServices: TopService[];
  topProjects: TopProject[];
  dailyCosts: DailyCost[];
  budgetAlert: boolean;
  insights: Insight[];
}

const fallbackPlans: BillingPlan[] = [
  ...publicPlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.priceMonthly,
    currency: 'USD',
    interval: 'monthly' as const,
    type: 'plan' as const,
    messageLimit: plan.messageLimit,
    features: plan.features,
    highlight: plan.highlight,
  })),
  {
    id: 'credit_pack_5k',
    name: '5.000 Mesaj Kredisi',
    description: 'Ani kampanyalar veya sezonluk yoğunluk için ideal ek paket.',
    price: 79,
    currency: 'USD',
    interval: 'one_time' as const,
    type: 'credit_pack' as const,
    creditAmount: 5000,
  },
  {
    id: 'credit_pack_25k',
    name: '25.000 Mesaj Kredisi',
    description: 'Büyüyen ekipler için indirimli toplu kredi.',
    price: 299,
    currency: 'USD',
    interval: 'one_time' as const,
    type: 'credit_pack' as const,
    creditAmount: 25000,
  },
];

export async function getBillingPlans(): Promise<BillingPlan[]> {
  if (!appApi.defaults.baseURL) {
    return fallbackPlans;
  }

  const response = await appApi.get<BillingPlan[]>('/api/billing/plans');
  return response.data;
}

export async function createCheckoutSession(
  payload: BillingCheckoutPayload
): Promise<BillingCheckoutResponse> {
  if (!payload.planId && !payload.creditPackId) {
    throw new Error('Plan veya kredi paketi seçimi yapılmalıdır.');
  }

  if (!appApi.defaults.baseURL) {
    const params = new URLSearchParams();
    if (payload.planId) params.set('planId', payload.planId);
    if (payload.creditPackId) params.set('creditPackId', payload.creditPackId);
    return {
      checkoutUrl: `/billing/checkout?${params.toString()}`,
    };
  }

  const response = await appApi.post<BillingCheckoutResponse>('/api/billing/checkout', payload);
  return response.data;
}

// Mock Data Generator
const mockDashboardData: BillingDashboardData = {
  totalCost: 1245.50,
  previousMonthCost: 1100.00,
  forecastCost: 1350.00,
  trendPercentage: 13.2,
  dailyCosts: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    cost: 30 + Math.random() * 20,
  })),
  topServices: [
    { name: 'AI Models (GPT-4)', cost: 850.20, change: 12 },
    { name: 'Vector DB', cost: 210.50, change: 5 },
    { name: 'Storage', cost: 120.00, change: -2 },
    { name: 'Compute', cost: 64.80, change: 8 },
  ],
  topProjects: [
    { name: 'Customer Support Bot', id: 'proj-001', cost: 950.00, trend: 15 },
    { name: 'Internal QA', id: 'proj-002', cost: 150.00, trend: 2 },
    { name: 'Marketing Agent', id: 'proj-003', cost: 145.50, trend: 10 },
  ],
  budgetAlert: false,
  insights: [
    {
      id: 'ins-1',
      type: 'suggestion',
      message: 'You could save roughly $120/mo by switching Vector DB plan.',
      actionLabel: 'View details',
    },
    {
      id: 'ins-2',
      type: 'info',
      message: 'Costs take up to 24 hours to appear in the dashboard.',
      actionLink: '#',
    }
  ]
};

export async function getBillingDashboardData(): Promise<BillingDashboardData> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (!appApi.defaults.baseURL) {
      return mockDashboardData;
  }
  
  // Future backend integration
  // const response = await appApi.get<BillingDashboardData>('/api/billing/dashboard');
  // return response.data;
  return mockDashboardData; 
}
