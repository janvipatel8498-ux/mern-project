import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
    try {
        const query = req.query.role ? { role: req.query.role } : {};
        const users = await User.find(query);

        const usersWithVendorId = users.map(user => ({
            ...user.toObject(),
            vendorId: user.vendorId || (user.role === 'vendor' ? `VND-${user._id.toString().slice(-6).toUpperCase()}` : undefined),
        }));

        res.json(usersWithVendorId);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot delete admin user');
            }

            // If vendor, also delete their products
            if (user.role === 'vendor') {
                await Product.deleteMany({ vendor: user._id });
            }

            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};


// @desc    Block/Unblock User
// @route   PUT /api/users/:id/block
// @access  Private/Admin
export const updateUserBlockStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                res.status(400);
                throw new Error('Cannot block admin user');
            }
            user.isBlocked = req.body.isBlocked;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isBlocked: updatedUser.isBlocked
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Approve/Reject Vendor or Delivery Agent
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
export const updateUserApproval = async (req, res, next) => {
    try {
        console.log(`Approving user ${req.params.id} with status ${req.body.isApproved}`);
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role !== 'vendor' && user.role !== 'delivery') {
                res.status(400);
                throw new Error('User is not a vendor or delivery agent');
            }
            user.isApproved = req.body.isApproved;
            if (req.body.isApproved) {
                user.approvedAt = new Date();
            }
            const updatedUser = await user.save();
            console.log(`User ${user.role} ${user.name} approved successfully`);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isApproved: updatedUser.isApproved,
                approvedAt: updatedUser.approvedAt,
            });
        } else {
            console.log(`User ${req.params.id} not found in database`);
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        console.error("Approval Error:", error);
        next(error);
    }
};
