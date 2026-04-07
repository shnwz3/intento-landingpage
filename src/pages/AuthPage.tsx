import { Mail, ShieldCheck } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SetupNotice } from '../components/SetupNotice';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { configured, loading, signInWithGoogle, signInWithPassword, signUpWithPassword, user } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [pending, setPending] = useState(false);

  const nextPath = searchParams.get('next') || '/dashboard';
  const selectedPlan = searchParams.get('plan');

  useEffect(() => {
    if (!loading && user) {
      navigate(nextPath, { replace: true });
    }
  }, [loading, navigate, nextPath, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    setInfo('');

    try {
      if (mode === 'signin') {
        const result = await signInWithPassword(email, password);

        if (result.error) {
          setError(result.error.message);
          return;
        }

        navigate(nextPath, { replace: true });
        return;
      }

      const result = await signUpWithPassword(email, password, fullName);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (result.needsEmailVerification) {
        setInfo('Account created. Check your email to confirm the address, then sign in.');
      } else {
        navigate(nextPath, { replace: true });
      }
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setPending(true);
    setError('');
    setInfo('');

    try {
      const result = await signInWithGoogle();

      if (result.error) {
        setError(result.error.message);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="px-6 md:px-8 py-10 md:py-16 max-w-7xl mx-auto">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-8 md:p-10 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)]">
          <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-4">Account Access</p>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface leading-tight">
            Turn the landing page into a real product entry point.
          </h1>
          <p className="mt-5 text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            Users can create an account, sign in with Google or email, buy a plan, and later use the same identity in
            the desktop app.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-10">
            <div className="rounded-2xl border border-outline-variant/15 bg-background/40 p-5">
              <ShieldCheck className="w-5 h-5 text-primary mb-3" />
              <h2 className="text-lg font-headline font-bold text-on-surface mb-2">Hosted auth</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Supabase handles sessions, password flows, email verification, and OAuth without custom auth code.
              </p>
            </div>

            <div className="rounded-2xl border border-outline-variant/15 bg-background/40 p-5">
              <Mail className="w-5 h-5 text-secondary mb-3" />
              <h2 className="text-lg font-headline font-bold text-on-surface mb-2">Billing-ready onboarding</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Once the user is signed in, the pricing page can send them straight into Stripe checkout.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-low p-8 md:p-10 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 rounded-full bg-background/50 p-1 mb-8">
            <button
              className={`flex-1 rounded-full px-4 py-2 text-sm font-headline font-bold transition-colors ${
                mode === 'signin' ? 'bg-primary text-on-primary' : 'text-on-surface/60 hover:text-on-surface'
              }`}
              onClick={() => setMode('signin')}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-2 text-sm font-headline font-bold transition-colors ${
                mode === 'signup' ? 'bg-primary text-on-primary' : 'text-on-surface/60 hover:text-on-surface'
              }`}
              onClick={() => setMode('signup')}
              type="button"
            >
              Create Account
            </button>
          </div>

          {selectedPlan ? (
            <div className="rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 mb-5 text-sm text-on-surface-variant">
              You are signing in to continue with the <span className="text-on-surface font-semibold">{selectedPlan}</span> plan.
            </div>
          ) : null}

          {!configured ? (
            <div className="mb-6">
              <SetupNotice
                body="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your website env file before testing sign-in."
                title="Supabase client setup is still missing"
              />
            </div>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' ? (
              <label className="block">
                <span className="block text-sm text-on-surface mb-2">Full name</span>
                <input
                  className="w-full rounded-2xl border border-outline-variant/20 bg-background/60 px-4 py-3 text-on-surface outline-none focus:border-primary"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Shahnawaz"
                  type="text"
                  value={fullName}
                />
              </label>
            ) : null}

            <label className="block">
              <span className="block text-sm text-on-surface mb-2">Email</span>
              <input
                className="w-full rounded-2xl border border-outline-variant/20 bg-background/60 px-4 py-3 text-on-surface outline-none focus:border-primary"
                onChange={(event) => setEmail(event.target.value.trim())}
                placeholder="name@company.com"
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="block text-sm text-on-surface mb-2">Password</span>
              <input
                className="w-full rounded-2xl border border-outline-variant/20 bg-background/60 px-4 py-3 text-on-surface outline-none focus:border-primary"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                type="password"
                value={password}
              />
            </label>

            {error ? <p className="text-sm text-error">{error}</p> : null}
            {info ? <p className="text-sm text-secondary">{info}</p> : null}

            <button
              className="w-full rounded-2xl bg-primary px-4 py-3 font-headline font-bold text-on-primary hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={pending}
              type="submit"
            >
              {pending ? 'Working...' : mode === 'signin' ? 'Continue to your account' : 'Create account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-outline-variant/20" />
            <span className="text-xs uppercase tracking-[0.2em] text-on-surface/40">Or</span>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>

          <button
            className="w-full rounded-2xl border border-outline-variant/20 bg-background/40 px-4 py-3 font-headline font-bold text-on-surface hover:border-primary/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={pending}
            onClick={handleGoogleSignIn}
            type="button"
          >
            Continue with Google
          </button>

          <p className="text-sm text-on-surface-variant mt-6 leading-relaxed">
            Need billing details first?{' '}
            <Link className="text-primary hover:text-secondary transition-colors" to="/pricing">
              View pricing
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
