import {Storage} from '@google-cloud/storage';
// Creates a client from a Google service account key
export const initStorage = (projectId, keyFilename) => {
    return new Storage({
        projectId: 'optical-precept-406804',
        keyFilename: 'Cvtemplatekey.json'
    });
};

// Mendapatkan daftar file dari bucket
export const getFilesFromBucket = async (bucket) => {
    try {
        const [files] = await bucket.getFiles();

        const fileDetails = files.map(async (file) => {
            // Mendapatkan metadata tambahan dari file
            const [metadata] = await file.getMetadata();

            // Melakukan URL encoding pada nama file
            const encodedFileName = encodeURIComponent(file.name);
            // Mendapatkan URL publik dari Google Cloud Storage bucket
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodedFileName}`

         // Memeriksa apakah file berada di root atau dalam folder
         const isInRoot = file.name.indexOf('/') === -1;

         if (isInRoot) {
             // Mendapatkan ukuran file dalam byte
             const fileSizeInBytes = file.metadata.size || 0;

             // Menentukan satuan ukuran file (MB atau KB)
             let fileSizeFormatted;
             let sizeUnit;

             if (fileSizeInBytes >= 1024 * 1024) {
                 // Jika ukuran file lebih dari 1 MB
                 fileSizeFormatted = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
                 sizeUnit = 'MB';
             } else {
                 // Jika ukuran file kurang dari 1 MB
                 fileSizeFormatted = (fileSizeInBytes / 1024).toFixed(2);
                 sizeUnit = 'KB';
             }

             return {
                 name: file.name,
                 url: publicUrl,
                 size: `${fileSizeFormatted} ${sizeUnit}`,
                 id: metadata.id || '',
                 description: metadata.metadata ? metadata.metadata.description || '' : '',
                 image:metadata.metadata ? metadata.metadata.image || '' : '',
                 createDate: metadata.timeCreated || '', // Contoh properti createDate
                 // Tambahkan properti tambahan lainnya sesuai kebutuhan
             };
         }
         return null;
     });

      // Menunggu semua promis untuk menyelesaikan eksekusi
      const fileDetailsArray = await Promise.all(fileDetails);

      // Filter out null values from the array
      const filteredFileDetailsArray = fileDetailsArray.filter((fileDetail) => fileDetail !== null);

      return filteredFileDetailsArray;
    } catch (error) {
        // Handle error sesuai kebutuhan Anda
        console.error('Error:', error);
        res.status(500).send('Error getting files from bucket:');
    }
};


