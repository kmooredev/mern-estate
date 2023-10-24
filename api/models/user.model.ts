import mongoose from 'mongoose';

interface DocumentResult<T> {
  _doc: T;
}

interface IEvent extends DocumentResult<IEvent> {
  _id: any;
  username: string;
  email: string;
  password: string;
  avatar: string;
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
    avatar: {
      type: String,
      default:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
