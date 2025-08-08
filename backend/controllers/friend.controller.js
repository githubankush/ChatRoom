// controllers/friend.controller.js
import User from '../models/user.model.js';
import FriendRequest from '../models/friend.model.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const io = req.app.get('io');

    if (!senderId || !receiverId) {
      return res.status(400).json({ message: 'Sender and receiver are required' });
    }
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't send a request to yourself" });
    }

    const sender = await User.findById(senderId).select('_id username profilePic friendRequestsSent friends');
    const receiver = await User.findById(receiverId).select('_id username profilePic friendRequestsReceived friends');

    if (!sender || !receiver) return res.status(404).json({ message: 'User not found' });

    // Prevent duplicate pending request or existing friendship
    const alreadyFriends = sender.friends?.some(id => id.toString() === receiverId);
    const alreadySent = sender.friendRequestsSent?.some(id => id.toString() === receiverId);
    const existingPending = await FriendRequest.findOne({
      from: senderId,
      to: receiverId,
      status: 'pending',
    });

    if (alreadyFriends) {
      return res.status(400).json({ message: 'You are already friends' });
    }
    if (alreadySent || existingPending) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Create FriendRequest document
    const newRequest = await FriendRequest.create({
      from: senderId,
      to: receiverId,
      status: 'pending',
    });

    // Push into user's arrays (optional redundancy for quick checks)
    sender.friendRequestsSent = sender.friendRequestsSent || [];
    receiver.friendRequestsReceived = receiver.friendRequestsReceived || [];

    if (!sender.friendRequestsSent.some(id => id.toString() === receiverId)) {
      sender.friendRequestsSent.push(receiverId);
      await sender.save();
    }

    if (!receiver.friendRequestsReceived.some(id => id.toString() === senderId)) {
      receiver.friendRequestsReceived.push(senderId);
      await receiver.save();
    }

    // Populate minimal sender info for socket payload
    const populatedReq = await FriendRequest.findById(newRequest._id)
      .populate('from', '_id username profilePic')
      .populate('to', '_id username profilePic');

    // Emit to receiver room (server is source-of-truth)
    if (io) {
      io.to(receiverId).emit('friendRequestNotification', {
        message: `${sender.username} sent you a friend request`,
        request: {
          _id: populatedReq._id,
          sender: {
            _id: populatedReq.from._id,
            username: populatedReq.from.username,
            profilePic: populatedReq.from.profilePic || null,
          },
          createdAt: populatedReq.createdAt,
        },
      });
    }

    return res.status(201).json({ message: 'Friend request sent successfully', request: populatedReq });
  } catch (error) {
    console.error('❌ Error sending friend request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    // you can pass userId via query or body; here we use query
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: 'userId query param is required' });

    const requests = await FriendRequest.find({ to: userId, status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('from', '_id username profilePic');

    // Map to client-friendly structure
    const payload = requests.map(r => ({
      _id: r._id,
      sender: {
        _id: r.from._id,
        name: r.from.username,
        profilePic: r.from.profilePic || null,
      },
      createdAt: r.createdAt,
    }));

    return res.status(200).json(payload);
  } catch (err) {
    console.error('❌ Error fetching friend requests:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId, userId } = req.body; // userId = receiver who accepts
    const io = req.app.get('io');

    if (!requestId || !userId) return res.status(400).json({ message: 'requestId and userId are required' });

    const reqDoc = await FriendRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: 'Friend request not found' });

    if (reqDoc.to.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }
    if (reqDoc.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Update request status
    reqDoc.status = 'accepted';
    await reqDoc.save();

    const receiver = await User.findById(userId);
    const sender = await User.findById(reqDoc.from);

    if (!receiver || !sender) return res.status(404).json({ message: 'User not found' });

    // Add to friends if not present
    receiver.friends = receiver.friends || [];
    sender.friends = sender.friends || [];

    if (!receiver.friends.some(id => id.toString() === sender._id.toString())) {
      receiver.friends.push(sender._id);
    }
    if (!sender.friends.some(id => id.toString() === receiver._id.toString())) {
      sender.friends.push(receiver._id);
    }

    // Remove from request lists (if you keep those arrays)
    receiver.friendRequestsReceived = (receiver.friendRequestsReceived || []).filter(id => id.toString() !== sender._id.toString());
    sender.friendRequestsSent = (sender.friendRequestsSent || []).filter(id => id.toString() !== receiver._id.toString());

    await receiver.save();
    await sender.save();

    // Notify sender about acceptance
    if (io) {
      io.to(sender._id.toString()).emit('friendRequestResponse', {
        requestId: reqDoc._id,
        action: 'accepted',
        by: {
          _id: receiver._id,
          username: receiver.username,
          profilePic: receiver.profilePic || null,
        },
        message: `${receiver.username} accepted your friend request`,
      });
    }

    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('❌ Error accepting friend request:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId, userId } = req.body; // userId = receiver who rejects
    const io = req.app.get('io');

    if (!requestId || !userId) return res.status(400).json({ message: 'requestId and userId are required' });

    const reqDoc = await FriendRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: 'Friend request not found' });

    if (reqDoc.to.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to reject this request" });
    }
    if (reqDoc.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    reqDoc.status = 'rejected';
    await reqDoc.save();

    const receiver = await User.findById(userId);
    const sender = await User.findById(reqDoc.from);
    if (!receiver || !sender) return res.status(404).json({ message: 'User not found' });

    // remove from request arrays if present
    receiver.friendRequestsReceived = (receiver.friendRequestsReceived || []).filter(id => id.toString() !== sender._id.toString());
    sender.friendRequestsSent = (sender.friendRequestsSent || []).filter(id => id.toString() !== receiver._id.toString());

    await receiver.save();
    await sender.save();

    // Notify sender about rejection
    if (io) {
      io.to(sender._id.toString()).emit('friendRequestResponse', {
        requestId: reqDoc._id,
        action: 'rejected',
        by: {
          _id: receiver._id,
          username: receiver.username,
        },
        message: `${receiver.username} rejected your friend request`,
      });
    }

    return res.status(200).json({ message: 'Friend request rejected' });
  } catch (err) {
    console.error('❌ Error rejecting friend request:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
