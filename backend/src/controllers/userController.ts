import { Request, Response, NextFunction } from "express";

const signUp = () => {};
const signIn = () => {};
const getUserByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = parseInt(req.params.id, 10);

  try {
  } catch (error) {}
};

export default {
  signUp,
  signIn,
  getUserByUserId,
};
