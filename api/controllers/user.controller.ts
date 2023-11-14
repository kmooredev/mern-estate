import { NextFunction } from 'express';
import errorHandler from '../utils/error.ts';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';
import Listing from '../models/listing.model.ts';

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

export const deleteUser = async (req: any, res: any, next: NextFunction) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req: any, res: any, next: NextFunction) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req: any, res: any, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }
    const { password: pass, ...userWithoutPassword } = user._doc;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
