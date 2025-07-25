import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

// @desc   Create or fetch chat
export const createChat = async (req, res) => {
  try {
    const { userId, isGroup = false, members = [], chatName } = req.body;

    if (!isGroup && !userId) {
      return res.status(400).json({ message: 'UserId required for private chat' });
    }

    if (isGroup) {
      if (members.length < 2 || !chatName) {
        return res.status(400).json({ message: 'Group must have a name and at least 2 members' });
      }

      const groupChat = await Chat.create({
        isGroup: true,
        chatName,
        members: [...members, req.user._id],
        admin: req.user._id,
      });

      const fullGroupChat = await Chat.findById(groupChat._id).populate('members', '-password');
      return res.status(201).json(fullGroupChat);
    }

    // One-to-one chat logic
    let existingChat = await Chat.findOne({
      isGroup: false,
      members: { $all: [req.user._id, userId] },
    }).populate('members', '-password');

    if (existingChat) return res.status(200).json(existingChat);

    const newChat = await Chat.create({
      isGroup: false,
      members: [req.user._id, userId],
    });

    const populatedChat = await Chat.findById(newChat._id).populate('members', '-password');
    return res.status(201).json(populatedChat);

  } catch (err) {
    res.status(500).json({ message: 'Server error while creating chat', error: err.message });
  }
};

// @desc   Fetch all chats for logged-in user
export const fetchUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate('members', '-password')
      .populate('admin', 'username')
      .populate({
        path: 'latestMessage',
        populate: { path: 'sender', select: 'username avatar' }
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chats', error: err.message });
  }
};

export const fetchMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching messages",
      error: err.message,
    });
  }
};

// @desc   Send a new message to a chat
// @route  POST /api/chat/:chatId/message
// @access Private
export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    const mediaFile = req.file; // multer parses this

    if (!chatId) return res.status(400).json({ message: "Chat ID is required" });
    if (!text && !mediaFile) {
      return res.status(400).json({ message: "Message content is empty" });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      chat: chatId,
      text: text || "",
      media: mediaFile ? mediaFile.buffer : undefined, // Store as buffer (if using in DB)
      mediaType: mediaFile ? mediaFile.mimetype : null,
      fileName: mediaFile ? mediaFile.originalname : null,
    });

    const populatedMessage = await newMessage.populate("sender", "username avatar");

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: populatedMessage._id,
    });

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({
      message: "Error sending message",
      error: err.message,
    });
  }
};
