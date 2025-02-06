import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Api from "../api/index";

const socket = io("http://localhost:5000"); // Persistent socket connection

const CreateRoom = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Listen for room creation
    socket.on("room-created", async ({ roomId }) => {
      const data = { room_id: roomId, host: username };
      localStorage.setItem("roomId", roomId)
      try {
        // ✅ Store roomId and host: username to API
        // await Api.createRoom(data);
        toast.success("Room created successfully!");

        // ✅ Store username locally
        localStorage.setItem("username", username);
      } catch (error) {
        console.error("Error saving room data:", error);
        toast.error("Failed to save room data. Please try again.");
      }
      
      
      navigate(`/dashboard/room/${roomId}`); 
    });

    return () => {
      socket.off("room-created"); // Cleanup
    };
  }, [navigate, username]);

  const handleCreateRoom = () => {
    const name = localStorage.getItem("username");

    if (!name || !name.trim()) {
      toast.error("Please enter a username in your profile first!");
      return;
    }

    setUsername(name); // Update the username state
    socket.emit("create-room", { hostUsername: name }); // Use name directly
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3f0877] text-black">
      <div className="flex flex-col bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold">Create a Game Room</h2>
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
