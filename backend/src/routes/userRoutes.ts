import express from "express";
import userController from "../controllers/userController";

const router = express.Router();

router.post("/register", userController.signUp);
router.post("/login", userController.signIn);
router.get("/user:id", userController.getUserByUserId);

module.exports = router;
