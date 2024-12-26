"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const placeRoutes = require("./routes/placesRoute");
const userRoutes = require("./routes/userRoutes");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use("/users", userRoutes);
app.use("/places", placeRoutes);
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
});
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running!" });
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = server;
