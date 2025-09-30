import express, { Request, Response } from 'express';

const router = express.Router();

// Get all projects
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        name: 'Gedung Perkantoran 15 Lantai',
        description: 'Struktur beton bertulang dengan sistem rangka terbuka',
        location: 'Jakarta, Indonesia',
        status: 'active',
        projectType: 'building',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

export default router;