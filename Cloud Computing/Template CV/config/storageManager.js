const {Storage} = require('@google-cloud/storage');
// Creates a client from a Google service account key
const initStorage = (projectId, keyFilename) => {
    return new Storage({
        projectId: 'optical-precept-406804',
        keyFilename: 'Cvtemplatekey.json'
    });
};

// Mendapatkan daftar file dari bucket
const getFilesFromBucket = async (bucket) => {
    const [files] = await bucket.getFiles();
    return files.map(file => ({
        name: file.name,
        url: file.metadata.mediaLink,
    }));
};

module.exports = {initStorage,getFilesFromBucket};
