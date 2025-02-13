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

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if MongoDB connection fails
  }
};
if (process.env.NODE_ENV !== "test") {
  startServer();
}

const server = app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});

export default server;
