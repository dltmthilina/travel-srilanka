"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const placeController_1 = __importDefault(require("../controllers/placeController"));
const router = express_1.default.Router();
router.post("/create-place", [
    (0, express_validator_1.check)("title").isString().not().isEmpty(),
    (0, express_validator_1.check)("description").isString().not().isEmpty(),
    (0, express_validator_1.check)("location").not().isEmpty(),
], placeController_1.default.createPlace);
router.get("/:pid", placeController_1.default.getPlaceByPid);
router.put("/:pid", [
    (0, express_validator_1.check)("title").isString(),
    (0, express_validator_1.check)("description").isString(),
    (0, express_validator_1.check)("district").isString(),
], placeController_1.default.updatePlace);
router.delete("/:pid", placeController_1.default.deletePlace);
router.get("/user/:uid", placeController_1.default.getAllPlacesByUid);
router.get("/:category", placeController_1.default.getPlacesByCategory);
router.get("/:district", placeController_1.default.getPlacesByDistrict);
module.exports = router;
