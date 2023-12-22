import express from 'express';
import { Storage } from '@google-cloud/storage';
import {initStorage} from '../config/storageManager.js'
import cors from 'cors';

// Inisialisasi penyimpanan dengan projectId dan keyFilename
const storage = initStorage('optical-precept-406804', 'Cvtemplatekey.json');
// The ID of your GCS bucket
const bucket = storage.bucket('scan-cv');


const router = express.Router();
router.use(cors());

// Endpoint untuk menyimpan history
router.post('/', async (req, res) => {
  try {
    const { userId, cvData } = req.body;

    const bucketName = 'scan-cv';
    const fileName = `${userId}/${Date.now()}.json`;

    const file = storage.bucket(bucketName).file(fileName);
    await file.save(JSON.stringify(cvData));

    res.status(201).json({ message: 'CV data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint untuk mengambil history
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const bucketName = 'scan-cv';
    const [files] = await storage.bucket(bucketName).getFiles({ prefix: userId });

    const history = await Promise.all(
      files.map(async file => {
        const content = await file.download();
        return JSON.parse(content.toString());
      })
    );

    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;