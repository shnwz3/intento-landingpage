import type { Response } from 'express';

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class MissingConfigurationError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = 'MissingConfigurationError';
    this.status = 503;
  }
}

export function sendError(response: Response, error: unknown) {
  if (error instanceof HttpError) {
    response.status(error.status).json({ error: error.message });
    return;
  }

  if (error instanceof MissingConfigurationError) {
    response.status(error.status).json({ error: error.message });
    return;
  }

  console.error(error);
  response.status(500).json({ error: 'Unexpected server error.' });
}
