import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SetupNotice } from '../components/SetupNotice';
import { useAuth } from '../context/AuthContext';
import { ApiError, createCheckoutSession, type BillingPlanId } from '../lib/api';
import { publicPlans } from '../lib/pricing';

export function PricingPage() {
  const navigate = useNavigate();
  const { configured, session, user } = useAuth();
  const [error, setError] = useState('');
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  async function handlePlanSelect(planId: string) {
    setError('');

    if (planId === 'free') {
      navigate(user ? '/dashboard' : '/auth?next=%2Fdashboard');
      return;
    }

    if (!user || !session) {
      navigate(`/auth?next=${encodeURIComponent('/pricing')}&plan=${planId}`);
      return;
    }

    setPendingPlan(planId);

    try {
      const response = await createCheckoutSession(planId as BillingPlanId, session);
      window.location.assign(response.url);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError('Unable to open Stripe checkout right now.');
      }
      setPendingPlan(null);
    }
  }

  return (
    <section className="px-6 md:px-8 py-10 md:py-16 max-w-7xl mx-auto">
      <div className="max-w-3xl mb-10">
        <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Pricing</p>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-5">
          Sell access by plan, keep the model keys on your backend.
        </h1>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          This page is now ready to send authenticated users into Stripe checkout. The website owns signup and
          subscriptions; your desktop app can later consume the same account and entitlements.
        </p>
      </div>

      {!configured ? (
        <div className="mb-8 max-w-3xl">
          <SetupNotice
            body="Before testing checkout, add the Supabase website keys and backend env vars from .env.example, then run the API server."
            title="Auth and billing still need environment variables"
          />
        </div>
      ) : null}

      {error ? (
        <div className="mb-8 rounded-2xl border border-error/25 bg-error/10 px-5 py-4 text-sm text-error max-w-3xl">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-4">
        {publicPlans.map((plan) => {
          const Icon = plan.icon;
          const isPending = pendingPlan === plan.id;

          return (
            <article
              className={`rounded-[2rem] border p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)] ${
                plan.highlight
                  ? 'border-primary/35 bg-primary/10'
                  : 'border-outline-variant/20 bg-surface-container-low'
              }`}
              key={plan.id}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-surface-container-high text-primary">
                  <Icon className="w-5 h-5" />
                </span>
                {plan.highlight ? (
                  <span className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-[10px] font-label uppercase tracking-[0.18em] text-primary">
                    {plan.highlight}
                  </span>
                ) : null}
              </div>

              <h2 className="text-2xl font-headline font-bold text-on-surface">{plan.name}</h2>
              <p className="mt-3 text-sm text-on-surface-variant leading-relaxed min-h-18">{plan.description}</p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-headline font-bold text-on-surface">{plan.monthlyPrice}</span>
                <span className="pb-2 text-sm text-on-surface-variant">/ month</span>
              </div>
              <p className="mt-4 text-sm text-secondary">{plan.dailyCredits} credits per day included</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li className="flex items-start gap-3 text-sm text-on-surface-variant" key={feature}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-headline font-bold transition-all ${
                  plan.highlight
                    ? 'bg-primary text-on-primary hover:scale-[1.01]'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
                disabled={Boolean(pendingPlan)}
                onClick={() => handlePlanSelect(plan.id)}
                type="button"
              >
                {isPending ? 'Opening checkout...' : plan.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-12 rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)]">
        <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Billing Flow</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-2">1. Account first</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Users authenticate with Supabase and get a stable account you can reuse in the desktop app.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-2">2. Stripe checkout</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Paid plans redirect into Stripe checkout and sync customer metadata back to Supabase.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-headline font-bold text-on-surface mb-2">3. Portal + entitlements</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              The dashboard reads plan data and opens Stripe&apos;s billing portal for self-serve upgrades or cancellations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
