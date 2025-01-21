import http from "http";
import dotenv from "dotenv";
import app from "./app.js"; // Assuming your Express app is here
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 5000;

// HTTP Server
const server = http.createServer(app);

// Socket.io Server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New player connected: ${socket.id}`);

  // Handle join room event
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`${username} joined room: ${roomId}`);
    
    // Notify room members
    io.to(roomId).emit("room-updated", { roomId, players: [...socket.rooms] });
  });

  // Handle symbol selection
  socket.on("select-symbol", ({ roomId, symbol }) => {
    console.log(`Player selected ${symbol} for room ${roomId}`);
    io.to(roomId).emit("symbol-selected", { symbol });
  });

  // Handle game move event
  socket.on("make-move", ({ roomId, player, position }) => {
    console.log(`Move made by ${player} in room ${roomId}: Position ${position}`);
    io.to(roomId).emit("move-made", { player, position });
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("Player disconnected", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
