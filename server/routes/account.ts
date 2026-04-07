import { Router } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth.js';
import { getProfile, upsertProfile, buildAccountSummary } from '../lib/profiles.js';
import { getSubscription } from '../lib/subscriptions.js';
import { HttpError, sendError } from '../lib/errors.js';

const router = Router();

router.get('/api/account/summary', requireAuth, async (request: AuthedRequest, response) => {
  try {
    const user = request.authUser;

    if (!user) {
      throw new HttpError(401, 'Not signed in.');
    }

    const profile = (await getProfile(user.id)) || (await upsertProfile(user));
    const subscription = await getSubscription(user.id);

    response.json(buildAccountSummary(user, profile, subscription));
  } catch (error) {
    sendError(response, error);
  }
});

export default router;
