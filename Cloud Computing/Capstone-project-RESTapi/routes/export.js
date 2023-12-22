import express from 'express';
import {initStorage, getFilesFromBucket} from '../config/storageManager.js'
import cors from 'cors';

const router = express.Router();
router.use(cors());

// Inisialisasi penyimpanan dengan projectId dan keyFilename
const storage = initStorage('optical-precept-406804', 'Cvtemplatekey.json');
// The ID of your GCS bucket
const bucket = storage.bucket('template-cv');

router.get('/files/list', async (req, res) => {
    try{
        const filelist = await getFilesFromBucket(bucket);
        res.status(200).send(filelist);
    }catch (error){
        console.error('Error:', error);
        res.status(500).send('Unable to read list of files');
    }
});

router.get('/files/download', async (req, res) => {
    try {
        const [files] = await bucket.getFiles();

        // Jika ada parameter selectedFile, unduh file .docx yang sesuai
        const selectedFileName = req.query.selectedFile;
        if (selectedFileName) {
            const selectedFile = files.find(file => file.name === selectedFileName && file.name.endsWith('.docx'));

            if (selectedFile) {
                const [metadata] = await selectedFile.getMetadata();
                const fileContent = await selectedFile.download();

                // Kirim respons dengan konten file
                res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename= '${selectedFile.name}'`);
                return res.send(fileContent[0]);
            } else {
                return res.status(404).send('Selected .docx file not found');
            }
        }

        // Jika tidak ada parameter selectedFile, unduh file acak dari bucket
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const [randomMetadata] = await randomFile.getMetadata();
        const randomFileContent = await randomFile.download();

        // Kirim respons dengan konten file
        res.setHeader('Content-Type', randomMetadata.contentType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename= '${randomFile.name}'`);
        return res.send(randomFileContent[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal service error!!');
    }
});


export default router;