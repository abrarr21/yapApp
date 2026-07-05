import mongoose, { Types } from 'mongoose';

export interface MessageData {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  deliveredAt: boolean;
}

const messageSchema = new mongoose.Schema<MessageData>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    deliveredAt: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
