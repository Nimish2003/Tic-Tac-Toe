import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Api from "../api";
const socket = io("http://localhost:5000"); // Persistent socket connection

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    
    socket.on("room-updated", ({ roomId, players }) => {
      toast.success("Successfully joined the room!");
      console.log(`Current players in room (${roomId}):`, players);
      navigate(`/dashboard/room/${roomId}`);
    });

    socket.on("error", ({ message }) => {
      toast.error(message);
    });

    return () => {
      socket.off("room-updated");
      socket.off("error");
    };
  }, [navigate]);

  const handleJoinRoom = async () => {
    const name = localStorage.getItem("username")
    console.log(name);
    
    if (!roomId.trim()) {
      toast.error("Please enter a valid Room ID and Username.");
      return;
    }
    
    const data ={
      room_id : roomId,
      opponent: name
    }
    try{
      console.log("addOpponent api called");
     const response =  await Api.addOpponent(data);
     console.log("Api response", response);
     
    }catch(err){
      console.error(err)
    }

    socket.emit("join-room", { roomId, username:name });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#3f0877]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Join a Room</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {/* <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        /> */}
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
