import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as HTTP-Only cookie
    console.log(`Generating token for user: ${userId}`);
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, // Always secure if possible, or at least in production
        sameSite: 'none', // Required for cross-site cookies (Vercel frontend -> Render backend)
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

export default generateToken;
