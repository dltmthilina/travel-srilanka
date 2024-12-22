import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.signUp);
router.post("/login", userController.signIn);
router.get("/:uid", userController.getUserByUserId);

module.exports = router;
