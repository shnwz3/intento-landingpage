import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { getAllowedOrigins, PORT } from './config.js';
import webhookRoutes from './routes/webhook.js';
import healthRoutes from './routes/health.js';
import accountRoutes from './routes/account.js';
import billingRoutes from './routes/billing.js';

dotenv.config();

const app = express();

// Webhook route MUST come before express.json() — Stripe needs the raw body.
app.use(webhookRoutes);

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || getAllowedOrigins().includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} is not allowed.`));
    },
  }),
);
app.use(express.json());

app.use(healthRoutes);
app.use(accountRoutes);
app.use(billingRoutes);

app.listen(PORT, () => {
  console.log(`Intento billing API listening on http://localhost:${PORT}`);
});
