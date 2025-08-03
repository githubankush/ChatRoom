// controllers/friend.controller.js
import User from '../models/user.model.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const io = req.app.get("io"); // Access the socket.io instance

    // ✅ Validate input
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Sender and receiver are required" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't send a request to yourself" });
    }

    // ✅ Find users
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check for existing request or friendship
    if (
      receiver.friendRequestsReceived.includes(senderId) ||
      receiver.friends.includes(senderId)
    ) {
      return res.status(400).json({ message: "Already requested or already friends" });
    }

    // ✅ Push friend request
    sender.friendRequestsSent.push(receiverId);
    receiver.friendRequestsReceived.push(senderId);

    await sender.save();
    await receiver.save();

    // ✅ Emit real-time notification to receiver (who joined their userId room)
    if (io) {
      io.to(receiverId).emit("friendRequestNotification", {
        message: `${sender.username} sent you a friend request`,
        from: {
          id: sender._id,
          username: sender.username,
          profilePic: sender.profilePic || null,
        },
      });
    }

    return res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("❌ Error sending friend request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { userId, senderId } = req.body;

  const user = await User.findById(userId);
  const sender = await User.findById(senderId);

  if (!user || !sender) return res.status(404).json({ message: "User not found" });

  user.friends.push(senderId);
  sender.friends.push(userId);

  // Remove from requests
  user.friendRequestsReceived = user.friendRequestsReceived.filter(
    (id) => id.toString() !== senderId
  );
  sender.friendRequestsSent = sender.friendRequestsSent.filter(
    (id) => id.toString() !== userId
  );

  await user.save();
  await sender.save();

  res.status(200).json({ message: "Friend request accepted" });
};

export const rejectFriendRequest = async (req, res) => {
  const { userId, senderId } = req.body;

  const user = await User.findById(userId);
  const sender = await User.findById(senderId);

  if (!user || !sender) return res.status(404).json({ message: "User not found" });

  user.friendRequestsReceived = user.friendRequestsReceived.filter(
    (id) => id.toString() !== senderId
  );
  sender.friendRequestsSent = sender.friendRequestsSent.filter(
    (id) => id.toString() !== userId
  );

  await user.save();
  await sender.save();

  res.status(200).json({ message: "Friend request rejected" });
};
