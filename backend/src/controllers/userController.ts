import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import HttpError from "../models/httpError";
import Tourist from "../models/user";
import bcrypt from "bcrypt";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  const { fname, lname, country, email, password } = req.body;

  if (!errors.isEmpty()) {
    next(new HttpError("Invalid inputs, please check your data", 400));
  }

  try {
    const existingUser = await Tourist.getByEmail(email);
    if (existingUser) {
      return next(new HttpError("User already exists. Please log in.", 422));
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new Tourist(
      null, // ID will be auto-generated
      fname,
      lname,
      email,
      country,
      hashedPassword,
      ""
    );

    const result = await newUser.create();
    if (result.affectedRows === 0) {
      throw new HttpError("Failed to create user.", 500);
    }
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    return next(new HttpError("Signup failed, please try again later.", 500));
  }
};
const signIn = (req: Request, res: Response, next: NextFunction) => {};

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
