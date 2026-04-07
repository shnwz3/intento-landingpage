import type { NextFunction, Request, Response } from 'express';
import type { User } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '../clients.js';
import { HttpError, sendError } from '../lib/errors.js';

export type AuthedRequest = Request & {
  authUser?: User;
};

function extractBearerToken(request: Request) {
  const authorization = request.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing bearer token.');
  }

  return authorization.slice('Bearer '.length).trim();
}

export async function requireAuth(request: AuthedRequest, response: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(request);
    const { data, error } = await getSupabaseAdmin().auth.getUser(token);

    if (error || !data.user) {
      throw new HttpError(401, 'Invalid or expired session.');
    }

    request.authUser = data.user;
    next();
  } catch (error) {
    sendError(response, error);
  }
}
