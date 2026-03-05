import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/debug', protect, (req, res) => {
    res.json({
        user: req.user,
        cookies: req.cookies
    });
});

export default router;
