import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(path.resolve(), 'uploads'));
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif|svg|heic|avif|bmp|tiff|ico/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(400).json({ message: err.message || err });
        }

        if (!req.file) {
            console.error("File upload failed: No file received or invalid file type.");
            return res.status(400).json({ message: "Invalid image format or no file received." });
        }

        res.json({
            message: 'Image uploaded',
            image: `/uploads/${req.file.filename}`,
        });
    });
});

export default router;
