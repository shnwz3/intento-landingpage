import { CreditCard, LockKeyhole, ServerCog, ShieldCheck } from 'lucide-react';

const securityItems = [
  {
    copy: 'Passwords stay inside Supabase Auth, while billing is handled by Stripe checkout and the Stripe customer portal.',
    icon: LockKeyhole,
    title: 'Managed authentication',
  },
  {
    copy: 'The website can sell plans without exposing provider keys because your backend becomes the only AI gateway.',
    icon: ServerCog,
    title: 'Backend-owned AI credentials',
  },
  {
    copy: 'Hosted checkout, subscriptions, and card management mean you do not have to build your own billing stack.',
    icon: CreditCard,
    title: 'Stripe-native billing',
  },
  {
    copy: 'Supabase row-level security and service-role only server actions give you a clean path to production hardening.',
    icon: ShieldCheck,
    title: 'Production-ready access model',
  },
];

export function SecuritySection() {
  return (
    <section className="px-6 md:px-8 py-16 md:py-24 max-w-7xl mx-auto" id="security">
      <div className="max-w-3xl mb-10">
        <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Trust Layer</p>
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-4">
          The product path is clear: website auth, hosted billing, backend-issued access.
        </h2>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          This setup keeps provider secrets on your server, gives users normal SaaS-style login, and prepares the
          desktop app to authenticate with the same account later.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {securityItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)]"
              key={item.title}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/12 text-primary mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface mb-3">{item.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{item.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
