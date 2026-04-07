export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const PORT = Number(process.env.PORT || 8787);

export function getAllowedOrigins() {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS || FRONTEND_URL)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const origins = Array.from(new Set(configuredOrigins));

  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000');
  }

  return Array.from(new Set(origins));
}

export function getSetupState() {
  return {
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    stripePricesConfigured: Boolean(
      process.env.STRIPE_PRICE_STARTER && process.env.STRIPE_PRICE_PRO && process.env.STRIPE_PRICE_TEAM,
    ),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}

export function toFrontendUrl(pathname: string) {
  const safePath = pathname.startsWith('/') ? pathname : '/dashboard';
  return new URL(safePath, FRONTEND_URL).toString();
}
