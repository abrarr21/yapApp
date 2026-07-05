import userModel, { type IUser } from '../models/user.model.js';

class UserDao {
  // create user
  async createUser({ username, email, password }: IUser) {
    return await userModel.create({
      username,
      email,
      password,
    });
  }

  // retrieve user by email or username
  async getUserByEmailOrUsername({ username, email }: Partial<Pick<IUser, 'email' | 'username'>>) {
    return await userModel.findOne({
      $or: [...(email ? [{ email }] : []), ...(username ? [{ username }] : [])],
    });
  }

  // retrieve user by userId
  async getUserByUserId(userId: string) {
    return await userModel.findById(userId);
  }

  // search user by provided username
  async searchUserByUsername(query: string) {
    return await userModel
      .find({
        username: { $regex: query, $options: 'i' },
      })
      .select('username email');
  }
}

export default new UserDao();
