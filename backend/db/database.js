import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connect to the SQLite database in the db folder
const db = new Database(path.join(__dirname, "tic-tac-toe.db"));

// Create tables if they don’t exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_x INTEGER REFERENCES users(id),
    player_o INTEGER REFERENCES users(id),
    status TEXT CHECK(status IN ('in_progress', 'completed', 'draw')) NOT NULL DEFAULT 'in_progress',
    winner INTEGER REFERENCES users(id) NULL
  );

  CREATE TABLE IF NOT EXISTS moves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER REFERENCES games(id),
    player INTEGER REFERENCES users(id),
    position INTEGER CHECK(position BETWEEN 0 AND 8) NOT NULL,
    move_number INTEGER NOT NULL
  );
`);

console.log("✅ Database initialized!");

export default db;
