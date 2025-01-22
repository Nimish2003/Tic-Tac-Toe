import http from "http";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import app from "./app.js";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const rooms = {}; 
const players = {};
let count = 0;

io.on("connection", (socket) => {
  console.log(`New player connected: ${socket.id}`);

  // Create a new room
  socket.on("create-room", ({ hostUsername }) => {
    const roomId = uuidv4();
    rooms[roomId] = { host: hostUsername, players: [hostUsername] };
    console.log(`Room created: ${roomId} by ${hostUsername}`);
    socket.join(roomId);
    socket.emit("room-created", { roomId });
    io.to(roomId).emit("room-updated", { roomId, players: rooms[roomId].players });
    count = 0;
  });

  // Join an existing room
  socket.on("join-room", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist." });
      return;
    }
    if (rooms[roomId].players.length >= 3) {
      socket.emit("error", { message: "Room is full." });
      return;
    }
    if (username != "Room") {
      rooms[roomId].players.push(username);
    }
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);

    io.to(roomId).emit("room-updated", { roomId, players: rooms[roomId].players });
  });

  // Handle symbol selection
  socket.on("select-symbol", ({ roomId, selectedSymbol }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist." });
      return;
    }
    console.log(`Symbol selected for room ${roomId}: ${selectedSymbol}`);
    io.emit("symbol-selected", { symbol: selectedSymbol, creatorId: rooms[roomId].players  });
  });

  // Handle board update when a move is made
    socket.on("make-move", ({ roomId, board, isXTurn }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist." });
      return;
    }

    console.log(`Move made in room ${roomId}. Board: ${board}, Next Turn: ${isXTurn ? "X" : "O"}`);
    
    
    io.emit("update-board", { board, isXTurn });
  });

  // Handle game over
  socket.on("game-over", ({ roomId, winner }) => {
    if (!rooms[roomId]) {
      socket.emit("error", { message: "Room does not exist." });
      return;
    } 

    console.log(`Game over in room ${roomId}. Winner: ${winner}`);

    // Broadcast the winner to all players in the room
    io.emit("game-over", { winner });
  });

  // Handle player leaving the room
  socket.on("leave-room", ({ roomId, username }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].players = rooms[roomId].players.filter((player) => player !== username);

    if (rooms[roomId].players.length === 0) {
      delete rooms[roomId]; // Remove empty room
    } else {
      rooms[roomId].host = rooms[roomId].players[0]; // Assign new host
      io.to(roomId).emit("room-updated", { roomId, players: rooms[roomId].players });
    }

    socket.leave(roomId);
    console.log(`${username} left room: ${roomId}`);
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    // Check if the disconnected player was in any room
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex((player) => player.socketId === socket.id);
      if (playerIndex !== -1) {
        const disconnectedPlayer = room.players.splice(playerIndex, 1)[0];
        console.log(`Player ${disconnectedPlayer} removed from room: ${roomId}`);

        // Update room or delete if empty
        if (room.players.length === 0) {
          delete rooms[roomId];
        } else {
          room.host = room.players[0]; // Assign new host
          io.to(roomId).emit("room-updated", { roomId, players: room.players });
        }

        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
