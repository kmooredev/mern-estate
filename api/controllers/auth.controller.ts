import User from '../models/user.model.ts';
import bcrypt from 'bcryptjs';

export const signup = async (req: any, res: any) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created sucussfully!' });
  } catch (err: Error | any) {
    res.status(500).json(err.message);
  }
};
