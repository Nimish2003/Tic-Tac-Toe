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
            const userId = req.params;
            console.log(userId);
            
            const data = await GameModel.getGameHistory(userId.id);
            console.log(data);
            
            const games = data.reduce((acc, row) => {
                const game = acc.find((g) => g.id === row.game_id);
                if (!game) {
                  acc.push({
                    id: row.game_id,
                    opponent: row.opponent,
                    result: row.status === "completed" ? (row.winner === userId ? "Win" : "Loss") : "Draw",
                    moves: [
                      {
                        player: row.player,
                        position: row.position,
                        move_number: row.move_number,
                      },
                    ],
                  });
                } else {
                  game.moves.push({
                    player: row.player,
                    position: row.position,
                    move_number: row.move_number,
                  });
                }
                return acc;
              }, []);
          
              res.status(200).json(games);

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

    async addOpponent(req, res) {
        try {
            const { room_id, opponent } = req.body;
            console.log('Request body:', req.body);            
            const result = await GameModel.addOpponent(room_id, opponent);
            console.log("result",result);
            res.status(201).json({ result, message: 'Opponent added successfully' });
        } catch (error) {
            console.error('Error adding opponent:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }



    async addGameDetails(req, res) {
        try {
          const { player_x, player_o } = req.body;
      
          console.log('Request body:', req.body);
      
          // Call the model method to add game details and get the game ID
          const gameId = await GameModel.addGameDetails(player_x, player_o);
      
          console.log("Game ID:", gameId);
      
          // Return the game ID as part of the response
          res.status(201).json({ gameId, message: 'Game Details Added' });
        } catch (error) {
          console.error('Error adding Game Details:', error);
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
