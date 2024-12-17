import express from "express";
import bodyParser from "body-parser";
const placeRoutes = require("./routes/placesRoute");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/places", placeRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;

/* export function add(a: number, b: number): number {
  return a + b;
} */
