import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { Place } from "../models/place";
import HttpError from "../models/httpError";

///////////////////////create place////////////////////////////////////////

const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs, please check your data", 400));
  }
  try {
    const { title, description, location, district, categories, userId } =
      req.body;
    const newPlace = new Place({
      title,
      description,
      location,
      district,
      categories,
      userId,
    });
    const result = await newPlace.save();
    res.status(201).json({
      message: "Place created successfully!",
      placeId: result.id,
    });
  } catch (error) {
    next(new HttpError(`Failed to create place. Please try again later`, 500));
  }
};

////////////////////////////getPlace by id//////////////////////////////////////

const getPlaceByPid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const placeId = req.params.pid;
  if (placeId === null || placeId === undefined) {
    next(new HttpError("Invalid place ID", 400));
    return;
  }
  try {
    const tourPlace = await Place.findById(placeId);
    if (tourPlace === null) {
      next(new HttpError("Place not found", 404));
      return;
    }
    res.status(200).json(tourPlace);
  } catch (error) {
    return next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
  }
};

/////////////////////get place by user id/////////////////

const getAllPlacesByUid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.uid;
  if (userId === null || userId === undefined) {
    next(new HttpError("Invalid User Id", 400));
    return;
  }
  try {
    const places = await Place.find({ userId });
    if (!places) {
      next(new HttpError("Not found places", 404));
      return;
    }
    res.status(200).json({
      places: places,
    });
  } catch (error) {
    next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
  }
};

//////////////////////////update place//////////////////////////////

const updatePlace = async (req: Request, res: Response, next: NextFunction) => {
  const placeId = req.params.pid;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs, please check your data", 400));
    return;
  }

  const { title, description, location, district, categories, userId } =
    req.body;
  try {
    const existingPlace = await Place.findById(placeId);
    if (!existingPlace) {
      next(new HttpError("Place not found", 404));
      return;
    }

    if (existingPlace.userId?.toString() !== userId) {
      next(new HttpError("Not authorized to update this place", 403));
      return;
    }

    existingPlace.title = title;
    existingPlace.description = description;
    existingPlace.location = location;
    existingPlace.district = district;
    existingPlace.categories = categories;

    const result = await existingPlace.save();

    if (!result) {
      next(new HttpError("Failed to update place", 500));
      return;
    }
    res.status(200).json({
      message: "Place updated successfully!",
      updatedPlace: result,
    });
  } catch (error) {
    return next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
  }
};

///////////////////////delete place////////////////////////////

const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  const placeId = req.params.pid;
  if (placeId === null || placeId === undefined) {
    next(new HttpError("Invalid place ID", 400));
    return;
  }
  try {
    const existingPlace = await Place.findById(placeId);
    if (!existingPlace) {
      next(new HttpError("Place not found", 404));
      return;
    }

    await Place.findByIdAndDelete(placeId);
    res
      .status(200)
      .json({ message: "Place deleted successfully!", deletedItemId: placeId });
  } catch (error) {
    next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
    return;
  }
};

//////////////////////////////////get all places by given key///////////////////////

const filterPlaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filters: any = {}; // Dynamic filters
    // Extract filters dynamically from query parameters
    for (const [key, value] of Object.entries(req.query)) {
      if (value) {
        if (key === "categories") {
          // Convert categories into an array and use $in for at least one match
          const categoriesArray = Array.isArray(value)
            ? value
            : value.toString().split(",");
          filters.categories = { $in: categoriesArray };
        } else {
          filters[key] = value;
        }
      }
    }

    if (Object.keys(filters).length === 0) {
      next(new HttpError("No filters provided", 400));
      return;
    }
    const places = await Place.find(filters);

    if (places.length === 0) {
      next(new HttpError("No places found matching the given criteria", 404));
      return;
    }
    res.status(200).json({ places });
  } catch (error) {
    next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
    return;
  }
};

export default {
  createPlace,
  getPlaceByPid,
  getAllPlacesByUid,
  updatePlace,
  deletePlace,
  filterPlaces,
};
