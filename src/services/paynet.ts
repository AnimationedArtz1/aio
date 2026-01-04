import appApi from '@/services/api';
import type { CheckoutSessionResponse } from '@/types';

interface PaynetCheckoutError {
  error: string;
}

export interface PaynetCheckoutOptions {
  planId: 'starter' | 'pro' | 'enterprise';
}

const PAYNET_RATE_LIMIT_MESSAGE = 'Please wait a moment before trying again.';

export const paynetService = {
  async createCheckoutSession(options: PaynetCheckoutOptions): Promise<CheckoutSessionResponse> {
    if (!appApi.defaults.baseURL) {
      throw new Error('API base URL is not configured');
    }

    try {
      const response = await appApi.post<CheckoutSessionResponse>(
        '/api/billing/checkout',
        { planId: options.planId }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as { response?: { data?: PaynetCheckoutError; status?: number } };
        
        if (axiosError.response?.status === 429) {
          throw new Error(PAYNET_RATE_LIMIT_MESSAGE);
        }
        
        if (axiosError.response?.data?.error) {
          throw new Error(axiosError.response.data.error);
        }
      }
      
      throw new Error('Failed to create checkout session. Please try again.');
    }
  },

  redirect(url: string): void {
    window.location.href = url;
  },
};
