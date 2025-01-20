import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
// import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
// app.use("/game", gameRoutes);

app.listen(PORT, () => console.log(`Server  http://localhost:${PORT}`));
