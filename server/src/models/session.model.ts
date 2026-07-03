import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface ISession {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
}

export interface ISessionMethods {
  compareRefreshToken(refToken: string): Promise<boolean>;
}

type SessionModel = mongoose.Model<ISession, {}, ISessionMethods>;

const sessionSchema = new mongoose.Schema<ISession, SessionModel, ISessionMethods>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true,
    },

    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

sessionSchema.pre('save', async function () {
  if (!this.isModified('refreshToken')) return;

  const salt = await bcrypt.genSalt(10);
  this.refreshToken = await bcrypt.hash(this.refreshToken, salt);
});

sessionSchema.methods.compareRefreshToken = async function (refToken: string) {
  return await bcrypt.compare(refToken, this.refreshToken);
};

const sessionModel = mongoose.model('Session', sessionSchema);

export default sessionModel;
