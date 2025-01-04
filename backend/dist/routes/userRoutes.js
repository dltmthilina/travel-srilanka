"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.check)("fname").isString().not().isEmpty(),
    (0, express_validator_1.check)("lname").isString().not().isEmpty(),
    (0, express_validator_1.check)("country").isString().not().isEmpty(),
    (0, express_validator_1.check)("email").isString().not().isEmpty(),
    (0, express_validator_1.check)("password").isString().not().isEmpty(),
], userController_1.default.signUp);
router.post("/login", userController_1.default.signIn);
router.get("/:uid", userController_1.default.getUserByUserId);
module.exports = router;
