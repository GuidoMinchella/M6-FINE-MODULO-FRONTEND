import multer from 'multer';
import path from 'node:path';

const storageL = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, Date.now() + path.extname(file.originalname));
        // path.extname fa questo: candele.jpg --> .jpg - node.pdf --> .pdf
    },
});

const uploadLocal = multer({ storage: storageL });

export default uploadLocal;