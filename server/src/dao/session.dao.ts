import type { Types } from 'mongoose';
import sessionModel, { type ISession } from '../models/session.model.js';

class SessionDao {
  // create session
  async createSession({ userId, refreshToken }: ISession) {
    return await sessionModel.create({ userId, refreshToken });
  }

  // retrieve a session of a user by userId
  async getSessionByUserId(userId: Pick<ISession, 'userId'>) {
    return await sessionModel.findOne(userId);
  }

  // update refresh token of a session by userId
  async updateSessionByUserId(userId: Types.ObjectId, refreshToken: string) {
    return await sessionModel.findOneAndUpdate({ userId }, { refreshToken }, { new: true });
  }

  // delete a session by provided userId
  async deleteSessionByUserId(userId: Types.ObjectId) {
    return await sessionModel.findOneAndDelete({ userId });
  }
}

export default new SessionDao();
