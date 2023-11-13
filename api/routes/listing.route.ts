import express from 'express';
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} from '../controllers/listing.controller.ts';
import { verifyToken } from '../utils/verifyUser.ts';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);

export default router;