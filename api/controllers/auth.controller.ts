import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model.ts';
import bcrypt from 'bcryptjs';
import errorHandler from '../utils/error.ts';
import jwt from 'jsonwebtoken';

export const signup = async (req: any, res: any, next: NextFunction) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (err: Error | any) {
    next(err);
  }
};

export const signin = async (req: any, res: any, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign(
      { id: validUser._id },
      // Use a default secret if process.env.JWT_SECRET is not defined
      process.env.JWT_SECRET || 'default_secret'
    );
    // remove the password from the rest of the response
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err: Error | any) {
    next(err);
  }
};

export const google = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'default secret'
      );
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id },
        process.env.JWT_SECRET || 'default secret'
      );
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User signed out!' });
  } catch (error) {
    next(error);
  }
};
