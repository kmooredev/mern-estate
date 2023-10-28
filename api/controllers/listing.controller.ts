import { NextFunction } from 'express';
import Listing from '../models/listing.model.ts';

export const createListing = async (req: any, res: any, next: NextFunction) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};
