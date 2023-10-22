import mongoose from 'mongoose';

interface DocumentResult<T> {
  _doc: T;
}

interface IEvent extends DocumentResult<IEvent> {
  _id: any;
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IEvent>(
  {
    username: {
      type: String,
      required: true,
      unique: true, // This means that the username must be unique
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
