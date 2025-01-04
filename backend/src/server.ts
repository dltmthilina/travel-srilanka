import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
const placeRoutes = require("./routes/placesRoute");
const userRoutes = require("./routes/userRoutes");
const currencyRoutes = require("./routes/currencyRoute");

interface CustomError extends Error {
  code?: number; // Optional property for error code
}

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/places", placeRoutes);
app.use("/currency", currencyRoutes);

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

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
