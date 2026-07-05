import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const conversationModel = mongoose.model('Conversation', conversationSchema);

export default conversationModel;
