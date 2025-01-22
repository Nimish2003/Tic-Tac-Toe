import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [symbol, setSymbol] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const username = localStorage.getItem("username");

  useEffect(() => {
  const username = localStorage.getItem("username");

  // ✅ Join the room when the component mounts
  socket.emit("join-room", { roomId, username:"Room" });

  // ✅ Listen for updates
    socket.on("room-updated", ({ players }) => {
    console.log("Players updated:", players);
    setPlayers([...players]);
    setIsHost(players[0] === username);
  });

  return () => {
    socket.off("room-updated");
  };
}, [roomId]);

  const handleSelectSymbol = (selectedSymbol) => {
    setSymbol(selectedSymbol);
    setGameStarted(true);
    socket.emit("select-symbol", { roomId, selectedSymbol });
  };

  // ✅ Exit Room
  const handleExitRoom = () => {
    socket.emit("leave-room", { roomId, username });
    navigate("/dashboard/create-room"); 
  };

  return (
    <div className="flex flex-col items-center bg-[#3f0877] h-screen justify-center text-white">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl text-black">Room ID: {roomId}</h1>
        <p className="text-black">Players: {players.join(", ") || "Waiting for players..."}</p>

        {players.length === 2 && isHost && !gameStarted && (
          <div className="mt-4">
            <h2 className="text-lg font-bold text-black">Choose your symbol</h2>
            <button
              className="m-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => handleSelectSymbol("X")}
            >
              X
            </button>
            <button
              className="m-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => handleSelectSymbol("O")}
            >
              O
            </button>
          </div>
        )}

        {gameStarted && (
          <p className="mt-4 text-green-600 font-bold">Game Started! You are {symbol}</p>
        )}

        {/* ✅ Exit Room Button */}
        <button
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
          onClick={handleExitRoom}
        >
          Exit Room
        </button>
      </div>
    </div>
  );
};

export default Room;
