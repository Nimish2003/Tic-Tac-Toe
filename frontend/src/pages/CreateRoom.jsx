import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // Import socket.io-client
import { toast } from "react-toastify";

const CreateRoom = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const socket = io("http://localhost:5000"); // Connect to the socket server

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    const data = {
      hostUsername: username,
    };

    try {
      // Emit a "create-room" event to the backend to create a new room
      socket.emit("create-room", data);

      // Listen for a response from the server with the new room ID
      socket.on("room-created", ({ roomId }) => {
        toast.success("Room created successfully!");
        navigate(`/dashboard/room/${roomId}`);
      });
    } catch (error) {
      toast.error("Failed to create room.");
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3f0877] text-black">
      <div className="flex flex-col bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold">Create a Game Room</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-4 p-2 rounded text-black border-2"
        />
        <button
          onClick={handleCreateRoom}
          className="mt-4 rounded-full bg-orange-500 px-6 py-2 font-bold text-white hover:bg-orange-600"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
