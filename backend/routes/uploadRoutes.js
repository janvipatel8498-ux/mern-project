import path from 'path';
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'freshmart_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'heic', 'avif', 'bmp', 'tiff', 'ico'],
        public_id: (req, file) => `image-${Date.now()}`,
    },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.error("File upload failed: No file received or invalid file type.");
        return res.status(400).json({ message: "Invalid image format or no file received." });
    }

    try {
        res.json({
            message: 'Image uploaded successfully to Cloudinary',
            image: req.file.path, // req.file.path contains the secure URL provided by Cloudinary
        });
    } catch (error) {
        console.error("Cloudinary Upload Route Error:", error);
        res.status(500).json({ message: 'Error returning Cloudinary image URL' });
    }
});

export default router;
