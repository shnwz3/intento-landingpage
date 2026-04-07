# Intento Website, Auth, and Billing

This repo now does more than show the landing page. It includes:

- a Vite React marketing site
- Supabase authentication for email/password and Google sign-in
- a pricing page wired for Stripe checkout
- an account dashboard for plan and billing status
- an Express API for Stripe checkout, Stripe customer portal, and account summary data

## Tech Stack

- `Frontend`: Vite + React + TypeScript + Tailwind
- `Auth`: Supabase Auth
- `Payments`: Stripe Checkout + Stripe Billing Portal + Stripe webhooks
- `Backend`: Express + TypeScript
- `Database`: Supabase Postgres tables in `supabase/schema.sql`

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill in the Supabase project values.
3. Fill in the Stripe secret, webhook secret, and Stripe price IDs.

Important variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_TEAM`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run the SQL from `supabase/schema.sql`.
4. In Supabase Auth, enable:
   - email/password
   - Google OAuth if you want the Google button active
5. Add your site URL and redirect URLs in Supabase Auth settings.

Recommended local redirect URLs:

- `http://localhost:3000/auth`
- `http://localhost:3000/dashboard`

## Stripe Setup

1. Create three recurring prices in Stripe for:
   - Starter
   - Pro
   - Team
2. Put those Stripe `price_...` IDs into:
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_TEAM`
3. Create a webhook endpoint that points to:
   - `http://localhost:8787/api/stripe/webhook`
4. Subscribe the webhook to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

If you use Stripe CLI locally, you can forward events to the local API.

## Run Locally

Install dependencies:

```bash
npm install
```

Run frontend and API together:

```bash
npm run dev:full
```

Or run them separately:

```bash
npm run dev
npm run dev:server
```

## Build

Build the frontend:

```bash
npm run build
```

Build the backend:

```bash
npm run build:server
```

Build both:

```bash
npm run build:all
```

## API Routes

- `GET /api/health`
- `GET /api/account/summary`
- `POST /api/billing/checkout-session`
- `POST /api/billing/customer-portal`
- `POST /api/stripe/webhook`

Authenticated routes expect a Supabase bearer token.

## What This Enables

- users can create accounts on the website
- users can buy plans without entering their own provider keys
- billing and auth state can later be reused inside the desktop app

## Next Recommended Step

The next backend slice is usage metering:

- deduct credits when the desktop app makes AI requests
- reset or refill plan balances on your chosen schedule
- expose real usage history in the dashboard
