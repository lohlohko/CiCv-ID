import express from 'express'
import multer from 'multer'
import admin from 'firebase-admin'
import serviceAccount from '../firebaseKey.json' assert { type: "json"}

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const upload = multer({ storage });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = (registrationToken) => {
  const message = {
    notification: {
      title: 'Notifikasi Upload',
      body: 'File telah berhasil diunggah!',
    },
    token: registrationToken,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Notifikasi berhasil dikirim:', response);
    })
    .catch((error) => {
      console.error('Error mengirim notifikasi:', error);
    });
};

// Endpoint untuk upload file, cocokkan CV dengan kriteria, dan kirim notifikasi
router.post('/upload-match-notify', upload.single('file'), async (req, res) => {
  try {
    // Proses file upload berhasil
    if (!req.file) {
      throw new Error('No file uploaded')
    }
    // Your file processing logic here
    // Ambil kriteria dari body request
    const selectedCriteria = req.body.criteria
    // Lakukan pencocokan CV dengan kriteria
    // Implementasikan logika pencocokan disini
    // Misalnya, membandingkan kriteria dengan data CV yang disimpan
    // Kemudian, kirim hasil pencocokan sebagai respons
    /*const matchResult =  Lakukan pencocokan CV di sini */;

    // Dapatkan registrationToken dari perangkat yang akan menerima notifikasi
    const registrationToken = 'device_registration_token'

    // Kirim notifikasi
    sendNotification(registrationToken);

    // Kirim hasil pencocokan dan respons lainnya
    res.json({ message: 'File uploaded, dan pencocokan berhasil', matchResult });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});


export default router 