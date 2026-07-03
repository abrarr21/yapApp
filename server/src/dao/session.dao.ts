import type { Types } from 'mongoose';
import sessionModel, { type ISession } from '../models/session.model.js';

class SessionDao {
  // create session
  async createSession({ userId, refreshToken }: ISession) {
    return await sessionModel.create({ userId, refreshToken });
  }

  // retrieve a session of a user by userId
  async getSessionByUserId(userId: Types.ObjectId) {
    return await sessionModel.findOne({ userId });
  }

  // update refresh token of a session by userId
  async updateSessionByUserId(userId: Types.ObjectId, refreshToken: string) {
    let session = await sessionModel.findOne({ userId });

    if (!session) {
      // Fallback: if session doesn't exist, create it (triggers pre-save hook)
      return await sessionModel.create({ userId, refreshToken });
    }
    // Updating this property and calling .save() WILL trigger the pre('save') hook!
    session.refreshToken = refreshToken;
    return await session.save();
  }

  // delete a session by provided userId
  async deleteSessionByUserId(userId: Types.ObjectId) {
    return await sessionModel.findOneAndDelete({ userId });
  }
}

export default new SessionDao();
