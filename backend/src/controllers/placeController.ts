import { Request, Response, NextFunction } from "express";
import TourPlace from "../models/place";

const createPlace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, location, userId } = req.body;
    if (!title || !description || !location || !userId) {
       res.status(400).json({ message: "Missing required fields" });
    }
    const newPlace = new TourPlace(null, title, description, location, userId);
  } catch (error) {}
};
const getAllPlacesByUid = () => {
  try {
  } catch (error) {}
};
const getPlaceByPid = () => {};
const getPlacesByDid = () => {};
const getPlacesByCategory = () => {};
const updatePlace = () => {};
const deletePlace = () => {};
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
