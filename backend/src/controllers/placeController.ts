import { Request, Response, NextFunction } from "express";
import { TourPlace } from "../models/place";

exports.createPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, description, location, userId } = req.body;
  const newPlace = new TourPlace(null, title, description, location, userId);
  newPlace
    .createPlace()
    .then(() => {})
    .catch(() => {});
};
exports.getAllPlacesByUid = () => {};
exports.getPlaceByUid = () => {};
exports.getPlaceByPid = () => {};
exports.getPlacesByDid = () => {};
exports.getPlacesByCategory = () => {};
