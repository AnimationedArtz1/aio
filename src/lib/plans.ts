import type { Plan } from '@/types';

export const publicPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Tek lokasyonlu ekipler için hızlı başlangıç paketi.',
    priceMonthly: 49,
    messageLimit: 3000,
    features: ['3 yapay zeka ajanı', '3.000 mesaj limiti', 'Email destek'],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Büyüyen işletmeler için gelişmiş limitler ve destek.',
    priceMonthly: 199,
    messageLimit: 30000,
    features: ['10 ajan', '30.000 mesaj', 'Telefon + email destek', 'Özel başarı yöneticisi'],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Birden fazla şubesi olan kurumsal yapılar için sınırsız ölçek.',
    priceMonthly: 999,
    messageLimit: 300000,
    features: ['Sınırsız ajan', '300.000+ mesaj', 'Özel SLA ve SSO', 'On-prem entegrasyon'],
  },
];

export const getPlanById = (planId?: string): Plan => {
  if (!planId) {
    return publicPlans[0];
  }

  return publicPlans.find((plan) => plan.id === planId) ?? publicPlans[0];
};
