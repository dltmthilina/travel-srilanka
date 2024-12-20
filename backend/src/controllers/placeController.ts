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
    const { title, description, location, userId } = req.body;
    const newPlace = new TourPlace(null, title, description, location, userId);
    const result = await newPlace.createPlace();
    res.status(201).json({
      message: "Place created successfully!",
      placeId: result.insertId,
    });
  } catch (error) {
    next(new HttpError("Failed to create place. Please try again later", 500));
  }
};

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
const updatePlace = () => {};
const deletePlace = () => {};
const getPlacesByDid = () => {};
const getPlacesByCategory = () => {};
const getAllPlacesByUid = () => {};
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
