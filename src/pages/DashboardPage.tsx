import { CreditCard, Gauge, RefreshCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SetupNotice } from '../components/SetupNotice';
import { useAuth } from '../context/AuthContext';
import { ApiError, createCustomerPortal, fetchAccountSummary, type AccountSummary } from '../lib/api';

export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const { configured, session, user } = useAuth();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingPending, setBillingPending] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      if (!session) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const nextSummary = await fetchAccountSummary(session);
        if (isMounted) {
          setSummary(nextSummary);
        }
      } catch (requestError) {
        if (isMounted) {
          if (requestError instanceof ApiError) {
            setError(requestError.message);
          } else {
            setError('Unable to load your account summary right now.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, [session]);

  async function handleManageBilling() {
    if (!session) {
      return;
    }

    setBillingPending(true);
    setError('');

    try {
      const response = await createCustomerPortal(session);
      window.location.assign(response.url);
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message);
      } else {
        setError('Unable to open the Stripe billing portal right now.');
      }
      setBillingPending(false);
    }
  }

  const checkoutSuccess = searchParams.get('checkout') === 'success';

  return (
    <section className="px-6 md:px-8 py-10 md:py-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
        <div>
          <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Dashboard</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-4">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}.
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl">
            This dashboard is ready to become the control center for plans, credits, subscription management, and the
            desktop app rollout.
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-headline font-bold text-on-primary hover:scale-[1.01] transition-transform"
          to="/pricing"
        >
          Upgrade Plan
        </Link>
      </div>

      {checkoutSuccess ? (
        <div className="mb-6 rounded-2xl border border-secondary/30 bg-secondary/10 px-5 py-4 text-sm text-secondary">
          Checkout completed. Stripe will sync your subscription into this dashboard as soon as the webhook lands.
        </div>
      ) : null}

      {!configured ? (
        <div className="mb-8 max-w-3xl">
          <SetupNotice
            body="Add the Supabase env vars to the website, then wire the backend with STRIPE_* and SUPABASE_SERVICE_ROLE_KEY values."
            title="Account data is waiting on backend setup"
          />
        </div>
      ) : null}

      {error ? (
        <div className="mb-8 rounded-2xl border border-error/25 bg-error/10 px-5 py-4 text-sm text-error max-w-3xl">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="h-40 rounded-[2rem] bg-surface-container-low animate-pulse" />
          <div className="h-40 rounded-[2rem] bg-surface-container-low animate-pulse" />
          <div className="h-40 rounded-[2rem] bg-surface-container-low animate-pulse" />
        </div>
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)]">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/12 text-primary mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-label uppercase tracking-[0.2em] text-on-surface/40 mb-3">Current Plan</p>
              <h2 className="text-3xl font-headline font-bold text-on-surface">{summary?.planLabel || 'Free'}</h2>
              <p className="text-sm text-on-surface-variant mt-3">
                Billing status: <span className="text-on-surface">{summary?.billingStatus || 'inactive'}</span>
              </p>
            </article>

            <article className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)]">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-secondary/12 text-secondary mb-5">
                <Gauge className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-label uppercase tracking-[0.2em] text-on-surface/40 mb-3">Credits</p>
              <h2 className="text-3xl font-headline font-bold text-on-surface">{summary?.creditsRemaining ?? 0}</h2>
              <p className="text-sm text-on-surface-variant mt-3">
                Daily allowance: <span className="text-on-surface">{summary?.dailyCreditLimit ?? 0}</span>
              </p>
            </article>

            <article className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-6 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)]">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/12 text-primary mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-label uppercase tracking-[0.2em] text-on-surface/40 mb-3">Account Email</p>
              <h2 className="text-xl font-headline font-bold text-on-surface break-all">
                {summary?.email || user?.email || 'Not available'}
              </h2>
              <p className="text-sm text-on-surface-variant mt-3">
                Renewal:{' '}
                <span className="text-on-surface">
                  {summary?.renewsAt ? new Date(summary.renewsAt).toLocaleDateString() : 'Not scheduled yet'}
                </span>
              </p>
            </article>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] mt-8">
            <article className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)]">
              <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">What this unlocks</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-outline-variant/15 bg-background/35 p-5">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Website auth</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    The account is already suitable for pricing, billing, support, and a future desktop login bridge.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/15 bg-background/35 p-5">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Stripe billing</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Checkout and customer portal routes are ready to manage subscriptions without exposing provider keys.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/15 bg-background/35 p-5">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Credits model</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    The schema now has space for credits, usage events, and subscription entitlements.
                  </p>
                </div>
                <div className="rounded-2xl border border-outline-variant/15 bg-background/35 p-5">
                  <h3 className="text-lg font-headline font-bold text-on-surface mb-2">Desktop next</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Next you can let the Electron app sign into the same backend instead of asking for API keys.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-6 md:p-8 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.6)]">
              <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Billing Tools</p>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-headline font-bold text-on-primary hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={billingPending || !summary?.stripeCustomerId}
                onClick={handleManageBilling}
                type="button"
              >
                <CreditCard className="w-4 h-4" />
                {billingPending ? 'Opening portal...' : 'Manage Billing'}
              </button>

              {!summary?.stripeCustomerId ? (
                <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
                  Once a paid checkout completes, the Stripe customer portal button will activate here.
                </p>
              ) : null}

              <Link
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-outline-variant/20 bg-background/40 px-4 py-3 font-headline font-bold text-on-surface hover:border-primary/35 transition-colors"
                to="/pricing"
              >
                <RefreshCcw className="w-4 h-4" />
                Change Plan
              </Link>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
