import express from "express";
import currencyController from "../controllers/currencyController";

const router = express.Router();

router.post("/add", currencyController.addCurrency);

module.exports = router;
