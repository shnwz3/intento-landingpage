import type Stripe from 'stripe';
import { getSupabaseAdmin, getStripe } from '../clients.js';
import { getPlanDefinition, getPlanFromPriceId, type PlanId } from '../plans.js';
import { HttpError } from './errors.js';

function currentTimestamp() {
  return new Date().toISOString();
}

function schemaSetupError(tableName: string) {
  return new HttpError(500, `Supabase table "${tableName}" is not ready yet. Run supabase/schema.sql first.`);
}

export async function getSubscription(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('plan_id,status,daily_credit_limit,credits_remaining,current_period_end,stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw schemaSetupError('subscriptions');
  }

  return data;
}

export async function syncCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabaseUserId;
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer && 'id' in session.customer ? session.customer.id : null;

  if (!userId || !customerId) {
    return;
  }

  const planId = (session.metadata?.planId as PlanId | undefined) || 'free';
  const plan = getPlanDefinition(planId);

  const { error } = await getSupabaseAdmin().from('profiles').upsert(
    {
      billing_status: session.payment_status === 'paid' ? 'active' : 'pending',
      credit_balance: plan.dailyCreditLimit,
      current_period_end: null,
      daily_credit_limit: plan.dailyCreditLimit,
      email: session.customer_details?.email || '',
      id: userId,
      plan_id: planId,
      stripe_customer_id: customerId,
      updated_at: currentTimestamp(),
    },
    { onConflict: 'id' },
  );

  if (error) {
    throw schemaSetupError('profiles');
  }

  if (typeof session.subscription === 'string') {
    const subscription = await getStripe().subscriptions.retrieve(session.subscription);
    await syncSubscription(subscription, false);
  }
}

export async function syncSubscription(subscription: Stripe.Subscription, downgradeToFree: boolean) {
  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer && 'id' in subscription.customer ? subscription.customer.id : null;

  if (!customerId) {
    return;
  }

  const { data: profile, error } = await getSupabaseAdmin()
    .from('profiles')
    .select(
      'id,email,full_name,stripe_customer_id,plan_id,billing_status,daily_credit_limit,credit_balance,current_period_end',
    )
    .eq('stripe_customer_id', customerId)
    .maybeSingle();

  if (error) {
    throw schemaSetupError('profiles');
  }

  if (!profile) {
    return;
  }

  const matchedPlan = getPlanFromPriceId(subscription.items.data[0]?.price.id || null);
  const planId = downgradeToFree ? 'free' : matchedPlan?.id || 'free';
  const plan = getPlanDefinition(planId);
  const currentPeriodEndEpoch = subscription.items.data[0]?.current_period_end;
  const currentPeriodEnd = currentPeriodEndEpoch
    ? new Date(currentPeriodEndEpoch * 1000).toISOString()
    : null;
  const existingSubscription = await getSubscription(profile.id);
  const creditsRemaining = downgradeToFree
    ? plan.dailyCreditLimit
    : existingSubscription?.credits_remaining ?? profile.credit_balance ?? plan.dailyCreditLimit;

  const { error: subscriptionError } = await getSupabaseAdmin().from('subscriptions').upsert(
    {
      credits_remaining: creditsRemaining,
      current_period_end: currentPeriodEnd,
      daily_credit_limit: plan.dailyCreditLimit,
      plan_id: planId,
      status: downgradeToFree ? 'canceled' : subscription.status,
      stripe_customer_id: customerId,
      stripe_price_id: subscription.items.data[0]?.price.id || null,
      stripe_subscription_id: subscription.id,
      updated_at: currentTimestamp(),
      user_id: profile.id,
    },
    { onConflict: 'user_id' },
  );

  if (subscriptionError) {
    throw schemaSetupError('subscriptions');
  }

  const { error: profileError } = await getSupabaseAdmin()
    .from('profiles')
    .update({
      billing_status: downgradeToFree ? 'inactive' : subscription.status,
      credit_balance: creditsRemaining,
      current_period_end: currentPeriodEnd,
      daily_credit_limit: plan.dailyCreditLimit,
      plan_id: planId,
      stripe_customer_id: customerId,
      updated_at: currentTimestamp(),
    })
    .eq('id', profile.id);

  if (profileError) {
    throw schemaSetupError('profiles');
  }
}
