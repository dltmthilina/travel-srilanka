"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const currencyController_1 = __importDefault(require("../controllers/currencyController"));
const router = express_1.default.Router();
router.post("/add", currencyController_1.default.addCurrency);
module.exports = router;
