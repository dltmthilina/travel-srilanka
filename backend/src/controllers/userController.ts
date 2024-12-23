import { Request, Response, NextFunction } from "express";
import HttpError from "../models/httpError";
import Tourist from "../models/user";

const signUp = () => {};
const signIn = () => {};
const getUserByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.uid, 10);
  if (userId === null || userId === undefined) {
    next(new HttpError("Invalid user ID", 400));
    return;
  }
  if (isNaN(userId)) {
    next(new HttpError("Invalid user ID", 400));
    return;
  }
  try {
    const tourist = await Tourist.getById(userId);
    if (!tourist) {
      next(new HttpError("User not found", 404));
      return;
    }
    res.status(200).json(tourist);
  } catch (error) {
    next(new HttpError("Invalid user ID", 400));
  }
};

export default {
  signUp,
  signIn,
  getUserByUserId,
};
