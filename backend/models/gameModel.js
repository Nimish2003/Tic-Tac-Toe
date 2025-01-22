import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';

class GameModel {
    static async createRoom(host, room_id) {
        try {
            
            const query = `INSERT INTO rooms (room_id, host, status) VALUES (?, ?, ?)`;
            
            
            await db.run(query, [room_id, host, 'waiting']);
        } catch (err) {
            throw err;
        }
    }

    static async addGameDetails(player_x, player_o ) {
      try {
          
          const query = `INSERT INTO games (player_x, player_o, status ) VALUES (?, ?, ?)`;
         const temp = await db.run(query, [player_x, player_o , 'in_progress']);
          console.log(temp);
          return temp.lastID;
          
      } catch (err) {
          throw err;
      }
  }

  static async addMove(game_id, player, position,move_number ) {
    try {
        
        const query = `INSERT INTO moves (game_id, player, position,move_number ) VALUES (?, ?, ?,?)`;
        const temp = await db.run(query, [game_id, player, position,move_number]);
        console.log(temp);
       
    } catch (err) {
        throw err;
    }
}

    static async addMove(gameId, player, position) {
        
        await db.run("INSERT INTO moves (game_id, player, position) VALUES (?, ?, ?)", [gameId, player, position]);
    }

    static async addOpponent( room_id, opponent) {
          try {              
              const query = `UPDATE rooms SET opponent = ? WHERE room_id = ?;`;
              await db.run(query, [opponent,room_id]);
          } catch (err) {
              throw err;
          }
      }
  
  
      

    static async updateGameStatus(gameId, status) {
        await db.run("UPDATE games SET status = ? WHERE id = ?", [status, gameId]);
    }

    static async getGameHistory(userId) {
     
      
        const query = `
          SELECT g.id AS game_id, 
                 CASE 
                   WHEN g.player_x = ? THEN g.player_o 
                   ELSE g.player_x 
                 END AS opponent,
                 g.winner,
                 g.status,
                 m.player,
                 m.position,
                 m.move_number
          FROM games g
          LEFT JOIN moves m ON g.id = m.game_id
          WHERE g.player_x = ? OR g.player_o = ?
          ORDER BY g.id, m.move_number;
        `;
        const data = await db.all(query, [userId, userId, userId]);

        return data
    }
    
    static async joinRoom(req, res) {
    try {
      const { roomId } = req.body;

      if (!roomId) {
        return res.status(400).json({ success: false, message: "Room ID is required." });
      }

      const room = await GameModel.getRoomById(roomId);

      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found." });
      }

      if (room.status !== "waiting") {
        return res.status(400).json({ success: false, message: "Room is full or already started." });
      }

      // Update the room to mark it as full
      await GameModel.updateRoomStatus(roomId, "playing");

      res.json({ success: true, message: "Successfully joined the room!", roomId });
    } catch (error) {
      console.error("Error joining room:", error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  }

// Get room details by room_id
static async getRoomById(roomId) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM rooms WHERE room_id = ?", [roomId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Update room status when an opponent joins
  static async updateRoomStatus(roomId, status) {
    return new Promise((resolve, reject) => {
      db.run("UPDATE rooms SET status = ? WHERE room_id = ?", [status, roomId], function (err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }

  // Add an opponent to the room
  static async addOpponentToRoom(roomId, opponent) {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE rooms SET opponent = ?, status = 'playing' WHERE room_id = ?",
        [opponent, roomId],
        function (err) {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  }
}

export default GameModel;
