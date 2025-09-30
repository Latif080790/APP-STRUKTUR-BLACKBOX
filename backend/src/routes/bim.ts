import express, { Request, Response } from 'express';

const router = express.Router();

// BIM file upload endpoint
router.post('/upload', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'BIM file berhasil diupload',
    fileId: Date.now().toString()
  });
});

export default router;