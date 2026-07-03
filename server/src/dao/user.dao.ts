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
  async getUserByEmailOrUsername({ username, email }: Pick<IUser, 'email' | 'username'>) {
    return await userModel.findOne({
      $or: [{ username }, { email }],
    });
  }
}

export default new UserDao();
