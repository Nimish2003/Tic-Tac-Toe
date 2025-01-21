import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Health Check Route
app.get("/", (req, res) => {
    res.json({ message: "Tic-Tac-Toe API is running..." });
});

export default app;
