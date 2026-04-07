import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database } from './database.js';
import { MissingConfigurationError } from './lib/errors.js';

let supabaseAdminClient: ReturnType<typeof createClient<Database>> | null = null;
let stripeClient: Stripe | null = null;

export function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new MissingConfigurationError(
      'Supabase admin credentials are missing. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    );
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseAdminClient;
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new MissingConfigurationError('Stripe is not configured. Add STRIPE_SECRET_KEY to the API env file.');
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
}

