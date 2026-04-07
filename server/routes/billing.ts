import { Router } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { getProfile, upsertProfile, ensureStripeCustomer } from '../lib/profiles.js';
import { getStripe } from '../clients.js';
import { getPaidPlanDefinition } from '../plans.js';
import { toFrontendUrl } from '../config.js';
import { HttpError, MissingConfigurationError, sendError } from '../lib/errors.js';

const router = Router();

router.post('/api/billing/checkout-session', requireAuth, async (request: AuthedRequest, response) => {
  try {
    const user = request.authUser;
    const requestedPlan = String(request.body?.planId || '');

    if (!user) {
      throw new HttpError(401, 'Not signed in.');
    }

    const plan = getPaidPlanDefinition(requestedPlan);

    if (!plan) {
      throw new HttpError(400, 'Select a paid plan before opening checkout.');
    }

    if (!plan.priceId) {
      throw new MissingConfigurationError(`Stripe price ID for the ${plan.label} plan is missing.`);
    }

    const profile = (await getProfile(user.id)) || (await upsertProfile(user));
    const customerId = await ensureStripeCustomer(user, profile);
    const checkout = await getStripe().checkout.sessions.create({
      allow_promotion_codes: true,
      cancel_url: toFrontendUrl('/pricing?checkout=cancelled'),
      customer: customerId,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        planId: plan.id,
        supabaseUserId: user.id,
      },
      mode: 'subscription',
      subscription_data: {
        metadata: {
          planId: plan.id,
          supabaseUserId: user.id,
        },
      },
      success_url: toFrontendUrl('/dashboard?checkout=success'),
    });

    if (!checkout.url) {
      throw new HttpError(500, 'Stripe did not return a checkout URL.');
    }

    response.json({ url: checkout.url });
  } catch (error) {
    sendError(response, error);
  }
});

router.post('/api/billing/customer-portal', requireAuth, async (request: AuthedRequest, response) => {
  try {
    const user = request.authUser;

    if (!user) {
      throw new HttpError(401, 'Not signed in.');
    }

    const profile = (await getProfile(user.id)) || (await upsertProfile(user));

    if (!profile.stripe_customer_id) {
      throw new HttpError(400, 'No Stripe customer exists yet. Complete checkout first.');
    }

    const portal = await getStripe().billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: toFrontendUrl('/dashboard'),
    });

    response.json({ url: portal.url });
  } catch (error) {
    sendError(response, error);
  }
});

export default router;
