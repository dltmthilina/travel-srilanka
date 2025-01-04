import { NextFunction, Request, Response } from "express";
import { CurrencyRate } from "../models/curr-ratio";
import HttpError from "../models/httpError";

const addCurrency = async (req: Request, res: Response, next: NextFunction) => {
  const { cur1, cur2, ratio } = req.body;

  const newCurRate = new CurrencyRate(cur1, cur2, ratio);

  try {
    const response = await newCurRate.addRatio();
    if (!response) {
      next(new HttpError("Failed to add currenct rate", 500));
      return;
    }
    res.status(201).json({
      message: "Place created successfully!",
      placeId: response?.insertId,
    });
  } catch (error) {
    next(error);
  }
};

export default { addCurrency };
