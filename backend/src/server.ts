import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
const placeRoutes = require("./routes/placesRoute");
const userRoutes = require("./routes/userRoutes");

dotenv.config({ path: ".env.local" });

const MONGO_URI = `mongodb+srv://CTL_1:${process.env.MONGODB_USER_KEY}@cluster0.ere8a.mongodb.net/travellife?retryWrites=true&w=majority&appName=Cluster0`;

interface CustomError extends Error {
  code?: number; // Optional property for error code
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/places", placeRoutes);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
  }
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running!" });
});

mongoose
  .connect(MONGO_URI)
  .then((result: any) => {
    console.log("mongodb connected");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err: any) => {
    console.log(err);
  });
