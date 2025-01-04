"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const httpError_1 = __importDefault(require("../models/httpError"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUp = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const { fname, lname, country, email, password } = req.body;
    if (!errors.isEmpty()) {
        next(new httpError_1.default("Invalid inputs, please check your data", 400));
    }
    try {
        const existingUser = await user_1.default.getByEmail(email);
        if (existingUser) {
            return next(new httpError_1.default("User already exists. Please log in.", 422));
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        const newUser = new user_1.default(null, // ID will be auto-generated
        fname, lname, email, country, hashedPassword, "");
        const result = await newUser.create();
        if (result.affectedRows === 0) {
            throw new httpError_1.default("Failed to create user.", 500);
        }
        res.status(201).json({ message: "User created successfully!" });
    }
    catch (error) {
        console.error(error);
        return next(new httpError_1.default("Signup failed, please try again later.", 500));
    }
};
const signIn = (req, res, next) => { };
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
