import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'vendor', 'admin', 'delivery'],
            default: 'user',
        },
        isOnline: {
            type: Boolean,
            default: true,
        },
        isApproved: {
            type: Boolean,
            default: function () {
                return this.role !== 'vendor' && this.role !== 'delivery';
            },
        },
        vendorId: {
            type: String,
            unique: true,
            sparse: true,
        },
        approvedAt: {
            type: Date,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        shippingAddress: {
            address: { type: String, default: '' },
            city: { type: String, default: '' },
            postalCode: { type: String, default: '' },
            country: { type: String, default: '' },
        }
    },
    {
        timestamps: true,
    }
);

// Method to match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

const User = mongoose.model('User', userSchema);

export default User;
