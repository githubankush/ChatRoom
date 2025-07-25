import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  isGroup: {
    type: Boolean,
    default: false,
  },

  chatName: {
    type: String,
    trim: true,
    default: '', // Optional for 1-1 chat
  },
  avatar: {
    type: String, // URL to avatar image
    default: '',  // Or set a default avatar URL
  },

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () { return this.isGroup; },
  },

  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Chat', chatSchema);
