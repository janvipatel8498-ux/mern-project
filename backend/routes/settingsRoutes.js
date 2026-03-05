import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// In a real application, these settings would be stored in the database
// For now, we will use memory to simulate settings persistence
let currentSettings = {
    maintenanceMode: false,
    commissionPercentage: 10,
};

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private/Admin
router.get('/', protect, admin, (req, res) => {
    res.json(currentSettings);
});

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, admin, (req, res) => {
    const { maintenanceMode, commissionPercentage } = req.body;

    if (maintenanceMode !== undefined) {
        currentSettings.maintenanceMode = maintenanceMode;
    }

    if (commissionPercentage !== undefined) {
        currentSettings.commissionPercentage = commissionPercentage;
    }

    res.json(currentSettings);
});

export default router;
