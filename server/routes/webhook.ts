import { Router } from 'express';
import express from 'express';
import type Stripe from 'stripe';
import { getStripe } from '../clients.js';
import { MissingConfigurationError, HttpError, sendError } from '../lib/errors.js';
import { syncCheckoutSession, syncSubscription } from '../lib/subscriptions.js';

const router = Router();

router.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new MissingConfigurationError('Stripe webhook signing secret is missing.');
    }

    const stripe = getStripe();
    const signature = request.headers['stripe-signature'];

    if (!signature || Array.isArray(signature)) {
      throw new HttpError(400, 'Missing Stripe signature.');
    }

    const event = stripe.webhooks.constructEvent(request.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'checkout.session.completed':
        await syncCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await syncSubscription(event.data.object as Stripe.Subscription, false);
        break;
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object as Stripe.Subscription, true);
        break;
      default:
        break;
    }

    response.json({ received: true });
  } catch (error) {
    sendError(response, error);
  }
});

export default router;
