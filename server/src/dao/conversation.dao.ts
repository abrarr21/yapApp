import type { Types } from 'mongoose';
import conversationModel from '../models/conversation.model.js';

class ConversationDao {
  // create a new conversation with the given participants
  async createConversation(participants: string[] = []) {
    return await conversationModel.create({ participants });
  }

  // retrieve a conversation by its Id
  async getConversationById(convoId: Types.ObjectId) {
    return await conversationModel.findById(convoId);
  }

  // retrieve all the conversations that include the specified user Id as a participants
  async getConversationByUserId(userId: Types.ObjectId) {
    return await conversationModel.find({ participants: { $in: [userId] } });
  }

  // retrieve a conversation that include all specified participants
  async getConversationByParticipants(participants: string[] = []) {
    return await conversationModel.findOne({ participants: { $all: participants } });
  }
}

export default new ConversationDao();
