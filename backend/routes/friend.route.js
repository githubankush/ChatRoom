// routes/friend.routes.js
import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest
} from '../controllers/friend.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send',authMiddleware, sendFriendRequest);
router.post('/accept',authMiddleware, acceptFriendRequest);
router.post('/reject',authMiddleware, rejectFriendRequest);

export default router;
