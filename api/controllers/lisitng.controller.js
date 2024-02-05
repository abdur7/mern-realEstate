import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const lisitng = await Listing.create(req.body);
    res.status(201).json(lisitng);
  } catch (error) {
    next(error);
  }
};
