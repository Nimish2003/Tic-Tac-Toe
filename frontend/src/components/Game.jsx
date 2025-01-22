import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Game = () => {
  const { roomId } = useParams();
  const [board, setBoard] = useState(Array(9).fill(null)); // Game board
  const [isXTurn, setIsXTurn] = useState(true); // Track whose turn it is
  const [winner, setWinner] = useState(null); // Track the winner
  const username = localStorage.getItem("username");
  const symbol = localStorage.getItem("symbol"); // Fetch the player's symbol
  const navigate = useNavigate();
  useEffect(() => {
    // Listen for board updates from the server
    socket.on("update-board", ({ board, isXTurn }) => {
      setBoard(board)
      setIsXTurn(isXTurn);
      console.log("From Game",board,isXTurn)
    });

    // Listen for game over
    socket.on("game-over", ({ winner }) => {
      setWinner(winner);
    });

    // return () => {
    //   socket.off("update-board");
    //   socket.off("game-over");
    // };
  }, []);

  const handleCellClick = (index) => {
    if (board[index] || winner || (symbol === "X" && !isXTurn) || (symbol === "O" && isXTurn)) {
      return; // Prevent moves when it's not the player's turn
    }

    const newBoard = [...board];
    newBoard[index] = symbol; // Use the player's symbol

    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    // Emit the updated board to the server
    socket.emit("make-move", { roomId, board: newBoard, isXTurn: !isXTurn });

    // Check for a winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      socket.emit("game-over", { roomId, winner: gameWinner });
    }
  };

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#3f0877] text-white">
      <h1 className="text-3xl mb-4">Tic Tac Toe</h1>
      <h2 className="mb-2">Room ID: {roomId}</h2>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            className="w-20 h-20 bg-white text-black text-2xl font-bold border"
            disabled={cell !== null} // Disable already played cells
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <p className="mt-4 text-green-500 text-lg">
          {winner === "X" ? "Player X" : "Player O"} wins!
        </p>
      )}
      {!winner && (
        <p className="mt-4">
          {isXTurn ? "Player X's Turn" : "Player O's Turn"}{" "}
          {isXTurn === (symbol === "X") ? "(Your Turn)" : "(Opponent's Turn)"}
        </p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg"
        onClick={() => {
          navigate("/dashboard/create-room");
        }}
        >
        Exit Game
      </button>
    </div>
  );
};

export default Game;
