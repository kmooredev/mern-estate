import { NextFunction } from 'express';
import Listing from '../models/listing.model.ts';
import errorHandler from '../utils/error.ts';

export const createListing = async (req: any, res: any, next: NextFunction) => {
  try {
    console.log(req.body);
    const listing = await Listing.create(req.body);
    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req: any, res: any, next: NextFunction) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Listing deleted',
    });
  } catch (error) {
    next(error);
  }
};
