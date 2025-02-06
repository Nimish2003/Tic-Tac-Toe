import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Api from "../api";

const socket = io("http://localhost:5000");

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [symbol, setSymbol] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [hostSymbol, setHostSymbol] = useState(null)
  const username = localStorage.getItem("username");
  const [game, setGame] = useState(false)
  const [oppSymbol, setOppSymbol] = useState(null)

  useEffect(() => {
    socket.emit("join-room", { roomId, username: "Room" });

    socket.on("room-updated", ({ players }) => {
      setPlayers([...players]);
      setIsHost(players[0] === username);
    });

    return () => {
      socket.off("room-updated");
    };
  }, [roomId]);

  const handleSelectSymbol = (selectedSymbol) => {
    setHostSymbol(selectedSymbol);
    socket.emit("select-symbol", { roomId, selectedSymbol });
    socket.on("symbol-selected",async (symbol, creatorId)=>{
      console.log("i am listening to symbol selected");
      console.log(isHost);
      
      if (isHost){
        localStorage.setItem("symbol", selectedSymbol);
      }else{
        if (selectedSymbol == "X"){
          localStorage.setItem("symbol", "O");
        }
        else{
          localStorage.setItem("symbol", "X");
        }
      }
      console.log("after if i am setting");
      const backendSymbol = localStorage.getItem("symbol")
      let player_x = null
      let player_o = null
       if ( isHost && backendSymbol == "X" ){
        player_x = players[0]
        player_o= players[1]
      }
      else if(isHost && backendSymbol == "O"){
        player_x = players[1]
        player_o = players[0]
      }
      const data = {
        player_x,
        player_o,
        room_id : roomId
      }

       if(isHost) {
        try {
        const gameupdate = await Api.addGameDetails(data)
        setIsHost(false)
        console.log(gameupdate);
        
      } catch (error) {
        console.error(error)
      }}
      navigate(`/dashboard/game/${roomId}`);
    })
  };

  useEffect(() => {
    socket.on("symbol-selected",(symbol, creatorId)=>{
      console.log("i am listening to symbol selected", symbol);
      
      if (isHost){
        localStorage.setItem("symbol", symbol.symbol);
      }else{
        if (symbol.symbol == "X"){
          localStorage.setItem("symbol", "O");
        }
        else{
          localStorage.setItem("symbol", "X");
        }
      }
      console.log("after if i am setting");
      // setGameStarted(true)
      navigate(`/dashboard/game/${roomId}`);
    })
  
  }, [])
  

  const handleExitRoom = () => {
    socket.emit("leave-room", { roomId, username });
    navigate("/dashboard/create-room");
  };

  // useEffect(() => {
  //   console.log("I am called");
  //   if (gameStarted) {
  //     console.log("I am navigated")
  //     navigate(`/dashboard/game/${roomId}`);
  //   }
  // }, [gameStarted, roomId]);



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
