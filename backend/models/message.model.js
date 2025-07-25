import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },

  text: {
    type: String,
    trim: true,
  },

   media: {
      buffer: Buffer,
      mimetype: String,
      originalName: String,
    },
  

  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
}, {
  timestamps: true,
});

export default mongoose.model('Message', messageSchema);
