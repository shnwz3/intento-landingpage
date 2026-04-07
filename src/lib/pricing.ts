import { Crown, Rocket, Sparkles, type LucideIcon } from 'lucide-react';

export type PublicPlanId = 'free' | 'starter' | 'pro' | 'team';

export type PublicPlan = {
  cta: string;
  dailyCredits: number;
  description: string;
  features: string[];
  highlight?: string;
  icon: LucideIcon;
  id: PublicPlanId;
  monthlyPrice: string;
  name: string;
};

export const publicPlans: PublicPlan[] = [
  {
    cta: 'Start Free',
    dailyCredits: 20,
    description: 'Perfect for early testers who want a light daily workflow and billing-free onboarding.',
    features: ['20 daily AI credits', 'Email and Google login', 'Download access for the desktop beta'],
    icon: Sparkles,
    id: 'free',
    monthlyPrice: '₹0',
    name: 'Free',
  },
  {
    cta: 'Choose Starter',
    dailyCredits: 150,
    description: 'Built for solo operators who want dependable daily usage without juggling provider keys.',
    features: ['150 daily AI credits', 'Hosted model access', 'Priority email support'],
    icon: Rocket,
    id: 'starter',
    monthlyPrice: '₹799',
    name: 'Starter',
  },
  {
    cta: 'Choose Pro',
    dailyCredits: 500,
    description: 'For heavy daily users who want higher limits, faster support, and ready-to-scale billing.',
    features: ['500 daily AI credits', 'Billing portal access', 'Early access to new desktop capabilities'],
    highlight: 'Most Popular',
    icon: Crown,
    id: 'pro',
    monthlyPrice: '₹1,500',
    name: 'Pro',
  },
  {
    cta: 'Choose Team',
    dailyCredits: 1500,
    description: 'For small teams standardizing on Intento with larger daily headroom and shared rollout support.',
    features: ['1,500 daily AI credits', 'Shared onboarding help', 'Priority roadmap and support lane'],
    icon: Crown,
    id: 'team',
    monthlyPrice: '₹3,000',
    name: 'Team',
  },
];
