import express from 'express';
import { createListing, deleteListing } from '../controllers/listing.controller.ts';
import { verifyToken } from '../utils/verifyUser.ts';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);

export default router;
