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

    static async addMove(gameId, player, position) {
        await db.run("INSERT INTO moves (game_id, player, position) VALUES (?, ?, ?)", [gameId, player, position]);
    }

    static async updateGameStatus(gameId, status) {
        await db.run("UPDATE games SET status = ? WHERE id = ?", [status, gameId]);
    }

    static async getGameHistory(userId) {
        return await db.all("SELECT * FROM games WHERE player1 = ? OR player2 = ?", [userId, userId]);
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
