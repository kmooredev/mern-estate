import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.ts';
import authRouter from './routes/auth.route.ts';

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO || '')
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
