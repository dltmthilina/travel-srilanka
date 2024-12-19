import express from "express";
import { check } from "express-validator";
import placeControllers from "../controllers/placeController";

const router = express.Router();

router.post(
  "/create-place",
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("location").not().isEmpty(),
  ],
  placeControllers.createPlace
);
router.get("/", placeControllers.getAllPlacesByUid);
router.get("/:pid", placeControllers.getPlaceByPid);
router.put("/:pid", placeControllers.updatePlace);
router.delete("/:pid", placeControllers.deletePlace);
router.get("/:category", placeControllers.getPlacesByCategory);

module.exports = router;
