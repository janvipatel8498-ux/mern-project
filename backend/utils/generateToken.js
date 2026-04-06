import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    // Set JWT as HTTP-Only cookie
    console.log(`Generating token for user: ${userId}`);
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none', 
    });
};

export default generateToken;
