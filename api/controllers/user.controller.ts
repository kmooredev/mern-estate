import { NextFunction } from 'express';
import errorHandler from '../utils/error.ts';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';

export const test = (_req: any, res: any) => {
  res.send('Api Route is working!');
};

export const updateUser = async (req: any, res: any, next: NextFunction) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    if (updatedUser !== null) {
      const { password, ...userWithoutPassword } = updatedUser._doc;
      res.status(200).json(userWithoutPassword);
    }
  } catch (error) {
    next(error);
  }
};
