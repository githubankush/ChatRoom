import express from 'express';
import { register, login, profile,logout, searchUsers, updateProfileAvatar,getAllUsers } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout',authMiddleware, logout);
router.get('/profile', authMiddleware, profile);
router.put('/avatar', authMiddleware,upload.single('avatar'), updateProfileAvatar);
router.get('/', authMiddleware, searchUsers); // 👈 /api/auth?search=query
router.get('/users', authMiddleware, getAllUsers); // 👈 Endpoint to get all users


export default router;
