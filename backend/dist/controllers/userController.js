"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpError_1 = __importDefault(require("../models/httpError"));
const user_1 = __importDefault(require("../models/user"));
const signUp = () => { };
const signIn = () => { };
const getUserByUserId = async (req, res, next) => {
    const userId = parseInt(req.params.uid, 10);
    if (userId === null || userId === undefined) {
        next(new httpError_1.default("Invalid user ID", 400));
        return;
    }
    if (isNaN(userId)) {
        next(new httpError_1.default("Invalid user ID", 400));
        return;
    }
    try {
        const tourist = await user_1.default.getById(userId);
        if (!tourist) {
            next(new httpError_1.default("User not found", 404));
            return;
        }
        res.status(200).json(tourist);
    }
    catch (error) {
        next(new httpError_1.default("Invalid user ID", 400));
    }
};
exports.default = {
    signUp,
    signIn,
    getUserByUserId,
};
