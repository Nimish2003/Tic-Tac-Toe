import React, { useEffect, useState } from "react";
import axios from "axios";
import Api from "../api";

const History = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username")

  useEffect(() => {
    // Fetch user's game history from API
    const fetchGameHistory = async () => {
      try {
        setLoading(true);
        const response = await Api.getGameHistory(username)
        setGames(response.data);
        console.log(response.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, [username]);

  if (loading) return <div>Loading game history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 className=" text-3xl font-bold mb-2">Game History</h1>
      {games.length === 0 ? (
        <p>No games found for this user.</p>
      ) : (
        games.map((game, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            {/* <h3>Game {game.id}</h3> */}
            <p><strong>Opponent:</strong> {game.opponent}</p>
            <p><strong>Result:</strong> {game.result}</p>
            <h4 className=" font-bold">Timeline of Moves:</h4>
            <ul>
              {game.moves.map((move, idx) => (
                <li key={idx}>
                  <strong>Player:</strong> {move.player} | <strong>Position:</strong> {move.position} | <strong>Move Number:</strong> {move.move_number}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
