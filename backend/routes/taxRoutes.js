import express from 'express';
import { getTaxConfigs, updateTaxConfig } from '../controllers/taxController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTaxConfigs)
    .put(protect, admin, updateTaxConfig);

export default router;
