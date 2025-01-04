"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const curr_ratio_1 = require("../models/curr-ratio");
const httpError_1 = __importDefault(require("../models/httpError"));
const addCurrency = async (req, res, next) => {
    const { cur1, cur2, ratio } = req.body;
    const newCurRate = new curr_ratio_1.CurrencyRate(cur1, cur2, ratio);
    try {
        const response = await newCurRate.addRatio();
        if (!response) {
            next(new httpError_1.default("Failed to add currenct rate", 500));
            return;
        }
        res.status(201).json({
            message: "Place created successfully!",
            placeId: response?.insertId,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.default = { addCurrency };
