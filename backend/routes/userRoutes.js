import express from 'express';
import {
    getUsers,
    deleteUser,
    updateUserBlockStatus,
    updateUserApproval,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/block').put(protect, admin, updateUserBlockStatus);
router.route('/:id/approve').put(protect, admin, updateUserApproval);

export default router;
