import express, { Request, Response } from 'express';

const router = express.Router();

// Get current user
router.get('/me', (req: Request, res: Response) => {
  res.json({
    success: true,
    user: {
      id: '1',
      email: 'engineer@example.com',
      fullName: 'Demo Engineer',
      organization: 'Structural Engineering Firm',
      role: 'engineer'
    }
  });
});

export default router;