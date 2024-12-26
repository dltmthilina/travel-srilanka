"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const place_1 = __importDefault(require("../models/place"));
const httpError_1 = __importDefault(require("../models/httpError"));
const createPlace = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        next(new httpError_1.default("Invalid inputs, please check your data", 400));
    }
    try {
        const { title, description, location, district, categories, userId } = req.body;
        const newPlace = new place_1.default(null, title, description, location, district, categories, userId);
        const result = await newPlace.createPlace();
        res.status(201).json({
            message: "Place created successfully!",
            placeId: result.insertId,
        });
    }
    catch (error) {
        next(new httpError_1.default(`Failed to create place. Please try again later`, 500));
    }
};
////////////////////////////getPlace by id//////////////////////////////////////
const getPlaceByPid = async (req, res, next) => {
    const placeId = parseInt(req.params.pid);
    if (placeId === null || placeId === undefined || isNaN(placeId)) {
        next(new httpError_1.default("Invalid place ID", 400));
        return;
    }
    try {
        const tourPlace = await place_1.default.getPlaceById(placeId);
        if (tourPlace === null) {
            next(new httpError_1.default("Place not found", 404));
            return;
        }
        res.status(200).json(tourPlace);
    }
    catch (error) {
        next(new httpError_1.default("An unexpected error occurred. Please try again later.", 500));
    }
};
//////////////////////////update place//////////////////////////////
const updatePlace = async (req, res, next) => {
    const placeId = parseInt(req.params.pid);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        next(new httpError_1.default("Invalid inputs, please check your data", 400));
        return;
    }
    if (placeId === null || placeId === undefined || isNaN(placeId)) {
        next(new httpError_1.default("Invalid place ID", 400));
        return;
    }
    const { title, description, location, district, categories } = req.body;
    try {
        const existingPlace = await place_1.default.getPlaceById(placeId);
        if (existingPlace === null) {
            next(new httpError_1.default("Place not found", 404));
            return;
        }
        const result = await place_1.default.updatePlace({
            id: existingPlace.id,
            title,
            description,
            location,
            district,
            categories,
            userId: existingPlace.userId,
        });
        if (!result) {
            next(new httpError_1.default("Failed to update place", 500));
            return;
        }
        res.status(200).json({
            message: "Place updated successfully!",
            updatedPlace: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deletePlace = async (req, res, next) => {
    const placeId = parseInt(req.params.pid);
    if (placeId === null || placeId === undefined || isNaN(placeId)) {
        next(new httpError_1.default("Invalid place ID", 400));
        return;
    }
    try {
        const existingPlace = await place_1.default.getPlaceById(placeId);
        if (!existingPlace) {
            next(new httpError_1.default("Place not found", 404));
            return;
        }
        const response = await place_1.default.deletePlace(placeId);
        res
            .status(200)
            .json({ message: "Place deleted successfully!", deletedItemId: placeId });
    }
    catch (error) {
        next(new httpError_1.default("An unexpected error occurred. Please try again later.", 500));
    }
};
const getAllPlacesByUid = async (req, res, next) => {
    const userId = parseInt(req.params.uid);
    if (userId === null || userId === undefined || isNaN(userId)) {
        next(new httpError_1.default("Invalid User Id", 400));
        return;
    }
    try {
        const places = await place_1.default.getPlacesByUid(userId);
        if (!places) {
            next(new httpError_1.default("Not found places", 404));
            return;
        }
        res.status(200).json({
            places: places,
        });
    }
    catch (error) {
        next(new httpError_1.default("An unexpected error occurred. Please try again later.", 500));
    }
};
const getPlacesByDistrict = (req, res, next) => {
    const district = req.body;
};
const getPlacesByCategory = () => { };
const getAllPlaceByCurrentLocation = () => { };
//const getPlaceByUid = () => {};
exports.default = {
    createPlace,
    getAllPlacesByUid,
    //getPlaceByUid,
    getPlaceByPid,
    getPlacesByDistrict,
    getPlacesByCategory,
    updatePlace,
    deletePlace,
};
