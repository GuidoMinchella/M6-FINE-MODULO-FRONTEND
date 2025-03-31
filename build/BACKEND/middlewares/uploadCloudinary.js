import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configura Cloudinary PRIMA di usare il CloudinaryStorage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura lo storage
const storageCloudinary = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'epicode',
    allowed_formats: ['jpg', 'png', 'jpeg'], // facoltativo ma utile
  },
});

// Middleware Multer
const uploadCloudinary = multer({ storage: storageCloudinary });

export default uploadCloudinary;
