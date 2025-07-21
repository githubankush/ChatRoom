import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
    console.log('Token from cookies:', token);
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.log('Decoded token:', decoded);

        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
    
}
