import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client"; // Import socket.io-client
import api from "../api"; // Using the centralized API file

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(""); // Add state for username
  const navigate = useNavigate();
  const socket = io("http://localhost:5000"); // Connect to the socket server

  const handleJoinRoom = async () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error("Please enter a valid Room ID and Username.");
      return;
    }

    const data = {
      roomId: roomId,
      username: username, // Send the username
    };

    try {
      console.log("request sent");

      // Join room using the backend API (optional, depending on your server-side implementation)
      const response = await api.joinGameRoom(data);

      if (response.success) {
        // Join the room via socket
        socket.emit("join-room", { roomId, username });

        // Listen for room updates after joining
        socket.on("room-updated", ({ roomId, players }) => {
          console.log(`${username} joined room: ${roomId}`);
          console.log("Current players in room:", players);

          // Handle room updates, for example, navigate to the room page
          toast.success("Successfully joined the room!");
          navigate(`/dashboard/room/${roomId}`);
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast.error(error.message || "Failed to join room.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#3f0877]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Join a Room
        </h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleJoinRoom}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-80 transition-all"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
