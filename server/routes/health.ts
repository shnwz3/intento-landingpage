import { Router } from 'express';
import { getSetupState } from '../config.js';

const router = Router();

router.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    setup: getSetupState(),
  });
});

export default router;
