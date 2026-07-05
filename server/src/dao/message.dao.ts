import messageModel, { type MessageData } from '../models/messages.model.js';

class MessageDao {
  async createMessage(messageData: MessageData) {
    return await messageModel.create(messageData);
  }
}

export default new MessageDao();
