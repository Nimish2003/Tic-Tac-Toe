import GameModel from "../models/gameModel.js";

class GameController {
    async startGame(req, res) {
        try {
            const { player1, player2 } = req.body;
            const gameId = createGame(player1, player2);
            res.status(201).json({ gameId, message: "Game started!" });
        } catch (error) {
            console.error("Start Game Error:", error);
            res.status(500).json({ error: "Could not start game" });
        }
    }

    async makeMove(req, res) {
        try {
            const { gameId, player, position } = req.body;
            addMove(gameId, player, position);
            res.json({ message: "Move registered!" });
        } catch (error) {
            console.error("Move Error:", error);
            res.status(500).json({ error: "Could not register move" });
        }
    }

    async finishGame(req, res) {
        try {
            const { gameId, status } = req.body;
            updateGameStatus(gameId, status);
            res.json({ message: "Game finished!" });
        } catch (error) {
            console.error("Finish Game Error:", error);
            res.status(500).json({ error: "Could not update game status" });
        }
    }

    async getHistory(req, res) {
        try {
            const userId = req.user.userId;
            const history = getGameHistory(userId);
            res.json(history);
        } catch (error) {
            console.error("History Fetch Error:", error);
            res.status(500).json({ error: "Could not fetch history" });
        }
    }

     async createRoom(req, res) {
        try {
            const { host, room_id } = req.body;
            
            const roomId = await GameModel.createRoom(host, room_id);
            res.status(201).json({ roomId, message: 'Room created successfully' });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async joinRoom(req, res) {
        try {
          const { roomId, opponent } = req.body;
          console.log("request received");
          
          // Fetch room details
          const room = await GameModel.getRoomById(roomId);
          if (!room) {
            return res.status(404).json({ success: false, message: "Room not found." });
          }
    
          // Check if room already has an opponent
          if (room.opponent) {
            return res.status(400).json({ success: false, message: "Room is full." });
          }
    
          // Add opponent to the room
          await GameModel.addOpponentToRoom(roomId, opponent);
    
          res.json({ success: true, message: "Successfully joined the room.", roomId });
        } catch (error) {
          console.error("Error joining room:", error);
          res.status(500).json({ success: false, message: "Server error." });
        }
      }
    
}

export default new GameController();
