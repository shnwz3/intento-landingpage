export type PlanId = 'free' | 'starter' | 'pro' | 'team';
type PaidPlanId = Exclude<PlanId, 'free'>;
type PriceEnvKey = 'STRIPE_PRICE_STARTER' | 'STRIPE_PRICE_PRO' | 'STRIPE_PRICE_TEAM';

type PlanDefinition = {
  dailyCreditLimit: number;
  id: PlanId;
  label: string;
  monthlyPrice: string;
  stripePriceEnv?: PriceEnvKey;
};

const planCatalog: Record<PlanId, PlanDefinition> = {
  free: {
    dailyCreditLimit: 20,
    id: 'free',
    label: 'Free',
    monthlyPrice: '$0',
  },
  starter: {
    dailyCreditLimit: 150,
    id: 'starter',
    label: 'Starter',
    monthlyPrice: '₹799',
    stripePriceEnv: 'STRIPE_PRICE_STARTER',
  },
  pro: {
    dailyCreditLimit: 500,
    id: 'pro',
    label: 'Pro',
    monthlyPrice: '₹1500',
    stripePriceEnv: 'STRIPE_PRICE_PRO',
  },
  team: {
    dailyCreditLimit: 1500,
    id: 'team',
    label: 'Team',
    monthlyPrice: '₹3000',
    stripePriceEnv: 'STRIPE_PRICE_TEAM',
  },
};

export function getPlanDefinition(planId: PlanId) {
  return planCatalog[planId];
}

export function getPaidPlanDefinition(planId: string) {
  if (planId !== 'starter' && planId !== 'pro' && planId !== 'team') {
    return null;
  }

  const definition = planCatalog[planId];
  const priceId = definition.stripePriceEnv ? process.env[definition.stripePriceEnv] : null;

  return {
    ...definition,
    priceId: priceId || null,
  };
}

export function getPlanFromPriceId(priceId: string | null | undefined): PlanDefinition | null {
  if (!priceId) {
    return null;
  }

  const paidPlanIds: PaidPlanId[] = ['starter', 'pro', 'team'];

  for (const planId of paidPlanIds) {
    const definition = planCatalog[planId];
    if (definition.stripePriceEnv && process.env[definition.stripePriceEnv] === priceId) {
      return definition;
    }
  }

  return null;
}
