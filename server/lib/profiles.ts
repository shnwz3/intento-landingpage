import type { User } from '@supabase/supabase-js';
import { getSupabaseAdmin, getStripe } from '../clients.js';
import type { ProfileRow, SubscriptionRow } from '../database.js';
import { getPlanDefinition } from '../plans.js';
import { HttpError } from './errors.js';

type ProfileRecord = Pick<
  ProfileRow,
  | 'billing_status'
  | 'credit_balance'
  | 'current_period_end'
  | 'daily_credit_limit'
  | 'email'
  | 'full_name'
  | 'id'
  | 'plan_id'
  | 'stripe_customer_id'
>;

type SubscriptionRecord = Pick<
  SubscriptionRow,
  'credits_remaining' | 'current_period_end' | 'daily_credit_limit' | 'plan_id' | 'status' | 'stripe_customer_id'
>;

export type { ProfileRecord, SubscriptionRecord };

function currentTimestamp() {
  return new Date().toISOString();
}

function schemaSetupError(tableName: string) {
  return new HttpError(500, `Supabase table "${tableName}" is not ready yet. Run supabase/schema.sql first.`);
}

export async function getProfile(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from('profiles')
    .select(
      'id,email,full_name,stripe_customer_id,plan_id,billing_status,daily_credit_limit,credit_balance,current_period_end',
    )
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw schemaSetupError('profiles');
  }

  return data;
}

export async function upsertProfile(user: User, extra: Partial<ProfileRecord> = {}) {
  const payload = {
    billing_status: extra.billing_status ?? 'inactive',
    credit_balance: extra.credit_balance ?? extra.daily_credit_limit ?? 20,
    current_period_end: extra.current_period_end ?? null,
    daily_credit_limit: extra.daily_credit_limit ?? 20,
    email: extra.email ?? user.email ?? '',
    full_name:
      extra.full_name ?? user.user_metadata.full_name ?? user.user_metadata.name ?? user.user_metadata.user_name ?? null,
    id: user.id,
    plan_id: extra.plan_id ?? 'free',
    stripe_customer_id: extra.stripe_customer_id ?? null,
    updated_at: currentTimestamp(),
  };

  const { data, error } = await getSupabaseAdmin()
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select(
      'id,email,full_name,stripe_customer_id,plan_id,billing_status,daily_credit_limit,credit_balance,current_period_end',
    )
    .single();

  if (error) {
    throw schemaSetupError('profiles');
  }

  return data;
}

export async function ensureStripeCustomer(user: User, profile: ProfileRecord) {
  if (profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  const customer = await getStripe().customers.create({
    email: profile.email || user.email || undefined,
    metadata: {
      supabaseUserId: user.id,
    },
    name: profile.full_name || undefined,
  });

  await upsertProfile(user, {
    stripe_customer_id: customer.id,
  });

  return customer.id;
}

export function buildAccountSummary(user: User, profile: ProfileRecord | null, subscription: SubscriptionRecord | null) {
  const activePlanId = subscription?.plan_id ?? profile?.plan_id ?? 'free';
  const plan = getPlanDefinition(activePlanId);
  const creditsRemaining = subscription?.credits_remaining ?? profile?.credit_balance ?? plan.dailyCreditLimit;

  return {
    billingStatus: subscription?.status ?? profile?.billing_status ?? 'inactive',
    creditsRemaining,
    dailyCreditLimit: subscription?.daily_credit_limit ?? profile?.daily_credit_limit ?? plan.dailyCreditLimit,
    email: profile?.email || user.email || '',
    fullName:
      profile?.full_name || user.user_metadata.full_name || user.user_metadata.name || user.user_metadata.user_name || '',
    planId: activePlanId,
    planLabel: plan.label,
    renewsAt: subscription?.current_period_end ?? profile?.current_period_end ?? null,
    stripeCustomerId: subscription?.stripe_customer_id ?? profile?.stripe_customer_id ?? null,
  };
}
