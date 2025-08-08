// routes/friend.route.js
import express from 'express';
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../controllers/friend.controller.js';

const router = express.Router();

// POST /api/friend/send
router.post('/send', sendFriendRequest);

// GET /api/friend/requests?userId=USER_ID
router.get('/requests', getFriendRequests);

// POST /api/friend/accept
// body: { requestId, userId }
router.post('/accept', acceptFriendRequest);

// POST /api/friend/reject
// body: { requestId, userId }
router.post('/reject', rejectFriendRequest);

export default router;
