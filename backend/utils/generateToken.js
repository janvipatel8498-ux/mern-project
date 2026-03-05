import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as HTTP-Only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'lax', // Use 'lax' for better local dev compatibility with proxies
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export default generateToken;
