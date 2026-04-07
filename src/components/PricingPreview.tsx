import { Link } from 'react-router-dom';
import { publicPlans } from '../lib/pricing';

export function PricingPreview() {
  return (
    <section className="px-6 md:px-8 py-16 md:py-24 max-w-7xl mx-auto" id="pricing">
      <div className="max-w-3xl mb-10">
        <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Pricing</p>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-4">
          Simple plans, hosted AI access, no user-managed API keys.
        </h2>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Users sign in, pick a plan, and use Intento. Your website handles billing, your backend owns the model keys,
          and the desktop app stays lightweight.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {publicPlans.map((plan) => {
          const Icon = plan.icon;

          return (
            <article
              className={`rounded-3xl border p-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] ${
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

              <h3 className="text-2xl font-headline font-bold text-on-surface">{plan.name}</h3>
              <p className="text-sm text-on-surface-variant mt-3 min-h-18">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-headline font-bold text-on-surface">{plan.monthlyPrice}</span>
                <span className="ml-2 text-sm text-on-surface-variant">/ month</span>
              </div>
              <p className="mt-4 text-sm text-secondary">{plan.dailyCredits} credits per day</p>

              <ul className="mt-6 space-y-3 text-sm text-on-surface-variant">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-headline font-bold text-on-primary hover:scale-[1.01] transition-transform"
          to="/pricing"
        >
          Open Full Pricing
        </Link>
      </div>
    </section>
  );
}
