import express from "express";
import GameController from "../controllers/gameController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/start", authMiddleware, GameController.startGame);
router.post("/move", authMiddleware, GameController.makeMove);
router.post("/finish", authMiddleware, GameController.finishGame);
router.get("/history", authMiddleware, GameController.getHistory);
router.post('/create-room', GameController.createRoom);
router.post("/join-room", GameController.joinRoom);
export default router;
