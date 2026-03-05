import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }


        const isVendor = role === 'vendor';
        const isDelivery = role === 'delivery';
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            vendorId: isVendor ? `VND-${Date.now()}` : undefined,
        });

        if (user) {
            // Only generate token if NOT a vendor or delivery agent
            if (user.role !== 'vendor' && user.role !== 'delivery') {
                generateToken(res, user._id);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                vendorId: user.vendorId,
                shippingAddress: user.shippingAddress,
                message: (user.role === 'vendor' || user.role === 'delivery') ? `Registration successful. Your ${user.role} account is pending administrator approval.` : undefined
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if user is blocked
            if (user.isBlocked) {
                res.status(403);
                throw new Error('Your account has been blocked by the admin.');
            }

            // Check if vendor or delivery agent is approved
            if ((user.role === 'vendor' || user.role === 'delivery') && !user.isApproved) {
                res.status(403);
                throw new Error(`Your ${user.role} account is pending administrator approval. You cannot login until approved.`);
            }

            generateToken(res, user._id);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                shippingAddress: user.shippingAddress,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.shippingAddress = req.body.shippingAddress || user.shippingAddress;
            user.avatar = req.body.avatar || user.avatar; // if we added an avatar field

            if (req.body.isOnline !== undefined) {
                user.isOnline = req.body.isOnline;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isApproved: updatedUser.isApproved,
                shippingAddress: updatedUser.shippingAddress,
                avatar: updatedUser.avatar,
                isOnline: updatedUser.isOnline
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
