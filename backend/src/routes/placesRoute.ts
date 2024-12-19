import express from "express";
import placeControllers from "../controllers/placeController";

const router = express.Router();

router.post("/create-place", placeControllers.createPlace);
router.get("/", placeControllers.getAllPlacesByUid);
router.get("/:pid", placeControllers.getPlaceByPid);
router.put("/:pid", placeControllers.updatePlace);
router.delete("/:pid", placeControllers.deletePlace);
router.get("/:category", placeControllers.getPlacesByCategory);

module.exports = router;
