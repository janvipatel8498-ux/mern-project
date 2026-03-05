import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
    getVendorProducts,
    getVendorProductReviews,
    getProductsByVendorAdmin,
} from '../controllers/productController.js';
import { protect, admin, vendor } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.get('/top', getTopProducts);
router.get('/vendor', protect, vendor, getVendorProducts);
router.get('/vendor/reviews', protect, vendor, getVendorProductReviews);
router.get('/admin/vendor/:id', protect, admin, getProductsByVendorAdmin);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, vendor, updateProduct)
    .delete(protect, vendor, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;
