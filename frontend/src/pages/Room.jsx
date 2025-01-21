import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

const Room = () => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const socket = io("http://localhost:5000");

  useEffect(() => {
    // Join the room with the roomId and username
    const username = localStorage.getItem("username");
    socket.emit("join-room", { roomId, username });

    // Listen for updated room data
    socket.on("room-updated", ({ players }) => {
      setPlayers(players);
      setIsHost(players[0] === username); // Assuming the first player is the host
    });

    // Cleanup the socket on unmount
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const selectSymbol = (symbol) => {
    socket.emit("select-symbol", { roomId, symbol });
  };

  return (
    <div className="flex flex-col items-center bg-[#3f0877] h-screen justify-center text-white">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl text-black">Room ID: {roomId}</h1>
        <p className="text-black">Players: {players.join(", ")}</p>

        {players.length === 2 && isHost && (
          <div className="mt-4">
            <button
              onClick={() => selectSymbol("X")}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              Choose X
            </button>
            <button
              onClick={() => selectSymbol("O")}
              className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Choose O
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Room;
