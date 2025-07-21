import express from 'express';
import { register, login } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, (req, res) => {
    res.send(`Welcome ${req.user.id}, your profile is secure!`);
})


export default router;
