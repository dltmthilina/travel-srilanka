import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import TourPlace from "../models/place";
import HttpError from "../models/httpError";

const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs, please check your data", 400));
  }
  try {
    const { title, description, location, district, categories, userId } =
      req.body;
    const newPlace = new TourPlace(
      null,
      title,
      description,
      location,
      district,
      categories,
      userId
    );
    const result = await newPlace.createPlace();
    res.status(201).json({
      message: "Place created successfully!",
      placeId: result.insertId,
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
  const placeId = parseInt(req.params.pid);
  if (placeId === null || placeId === undefined || isNaN(placeId)) {
    next(new HttpError("Invalid place ID", 400));
    return;
  }
  try {
    const tourPlace = await TourPlace.getPlaceById(placeId);
    if (tourPlace === null) {
      next(new HttpError("Place not found", 404));
      return;
    }
    res.status(200).json(tourPlace);
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
  const placeId = parseInt(req.params.pid);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs, please check your data", 400));
    return;
  }
  if (placeId === null || placeId === undefined || isNaN(placeId)) {
    next(new HttpError("Invalid place ID", 400));
    return;
  }
  const { title, description, location, district, categories } = req.body;
  try {
    const existingPlace = await TourPlace.getPlaceById(placeId);
    if (existingPlace === null) {
      next(new HttpError("Place not found", 404));
      return;
    }
    const result = await TourPlace.updatePlace({
      id: existingPlace.id,
      title,
      description,
      location,
      district,
      categories,
      userId: existingPlace.userId,
    });

    if (!result) {
      next(new HttpError("Failed to update place", 500));
      return;
    }
    res.status(200).json({
      message: "Place updated successfully!",
      updatedPlace: result,
    });
  } catch (error) {
    next(error);
  }
};
const deletePlace = async (req: Request, res: Response, next: NextFunction) => {
  const placeId = parseInt(req.params.pid);
  if (placeId === null || placeId === undefined || isNaN(placeId)) {
    next(new HttpError("Invalid place ID", 400));
    return;
  }
  try {
    const existingPlace = await TourPlace.getPlaceById(placeId);
    if (!existingPlace) {
      next(new HttpError("Place not found", 404));
      return;
    }
    const response = await TourPlace.deletePlace(placeId);
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
  }
};
const getAllPlacesByUid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.uid);
  if (userId === null || userId === undefined || isNaN(userId)) {
    next(new HttpError("Invalid User Id", 400));
    return;
  }
  try {
    const places = await TourPlace.getPlacesByUid(userId);
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
const getPlacesByDid = () => {};
const getPlacesByCategory = () => {};
const getAllPlaceByCurrentLocation = () => {};

//const getPlaceByUid = () => {};

export default {
  createPlace,
  getAllPlacesByUid,
  //getPlaceByUid,
  getPlaceByPid,
  getPlacesByDid,
  getPlacesByCategory,
  updatePlace,
  deletePlace,
};
