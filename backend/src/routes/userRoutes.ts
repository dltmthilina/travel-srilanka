import express from "express";
import userController from "../controllers/userController";
import { check } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  [
    check("name").isString().not().isEmpty(),
    check("country").isString().not().isEmpty(),
    check("email").isString().not().isEmpty(),
    check("password").isString().not().isEmpty(),
  ],
  userController.signUp
);
router.post("/login", userController.signIn);
router.get("/:uid", userController.getUserByUserId);

module.exports = router;
