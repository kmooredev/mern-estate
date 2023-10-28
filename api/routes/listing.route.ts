import express from 'express';
import { createListing } from '../controllers/listing.controller.ts';
import { verifyToken } from '../utils/verifyUser.ts';

const router = express.Router();

router.post('/create', verifyToken, createListing);

export default router;
