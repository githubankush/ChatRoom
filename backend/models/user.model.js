import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  avatar: {
    type: String, // URL to avatar image
    default: '',  // Or set a default avatar URL
  },

  isOnline: {
    type: Boolean,
    default: false,
  },

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', // link to one-to-one or group chat
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true, // adds createdAt and updatedAt
});
 
export default mongoose.model('User', userSchema);
