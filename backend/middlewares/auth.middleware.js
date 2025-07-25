import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
export const authMiddleware = async (req, res, next) => {
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
        console.log('Decoded token id:', decoded.id);
        req.user = await User.findById(decoded.id).select('-password');
        console.log('User details:', req.user);
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
    
}
