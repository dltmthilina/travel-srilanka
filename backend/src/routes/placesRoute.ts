import express from "express";
import { check } from "express-validator";
import placeControllers from "../controllers/placeController";

const router = express.Router();

router.post(
  "/create-place",
  [
    check("title").isString().not().isEmpty(),
    check("description").isString().not().isEmpty(),
    check("location").not().isEmpty(),
  ],
  placeControllers.createPlace
);
router.get("/", placeControllers.getAllPlacesByUid);
router.get("/:pid", placeControllers.getPlaceByPid);
router.put(
  "/:pid",
  [check("title").isString(), check("description").isString()],
  placeControllers.updatePlace
);
router.delete("/:pid", placeControllers.deletePlace);
router.get("/:category", placeControllers.getPlacesByCategory);

module.exports = router;
