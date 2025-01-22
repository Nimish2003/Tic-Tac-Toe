## Demo

[![Watch the Video](https://via.placeholder.com/800x450?text=Click+to+Watch+Demo)](https://drive.google.com/file/d/1WQSnP76bNAvFrot2JZVsCm2sKgrkZOxc/view)

**Click the image above to watch the video demo of the Tic-Tac-Toe game in action.**
# Tic-Tac-Toe Game (Full-Stack Application)

This project is a full-stack Tic-Tac-Toe game where users can play against each other in real-time, track their game history, and enjoy a seamless gaming experience. Built using modern technologies, it features secure authentication, a scalable backend, and a dynamic frontend.

---

## Features

### User Authentication
- Secure authentication using JWT with a 24-hour token expiration.
- Passwords are securely hashed using bcrypt.

### Real-Time Gameplay
- Users create rooms, join existing rooms, and play in real-time using Socket.IO.
- The host chooses their symbol (X or O) and decides who makes the first move.

### Match History
- Players can view their previous matches, including game outcomes (win/loss/draw).
- Each game shows the timeline of moves made by each player.

### Game Status
- Displays the current game status (ongoing, completed, or draw).

### Move Tracking
- Each move is recorded and stored in the database for review.

---

## Tech Stack

### Frontend
- **React.js (Vite-based)**: Fast and responsive UI.
- **Axios**: For communication with the backend API.
- **Tailwind CSS**: For clean, responsive, utility-first styling.

### Backend
- **Node.js & Express.js**: For server-side logic and API routing.
- **SQLite3**: For persisting user, game, and move data.
- **Socket.IO**: For real-time communication during gameplay.

### Authentication
- **JWT**: Secure token-based authentication.
- **bcrypt**: Password hashing for user security.

---

## Database Schema

### Collections:
1. **Users**
   - `username`: String, unique.
   - `password`: String (hashed using bcrypt).

2. **Games**
   - `gameId`: Integer, unique.
   - `player_x`: String (host's username).
   - `player_o`: String (opponent's username).
   - `status`: String (in_progress, completed).
   - `winner`: String (username of winner).

3. **Moves**
   - `gameId`: Integer (reference to a specific game).
   - `player`: String (username of the player who made the move).
   - `position`: Integer (position of move made).
   - `move_number`: Integer (when move was made).

4. **Rooms**
   - `roomId`: String, unique.
   - `host`: String (username of the room creator).
   - `opponent`: String (username of the joined player, if applicable).
   - `status`: String (active/complete).
   - `created_at`: Date.

---

## API Routes

### Authentication Routes
| Method | Endpoint       | Description                     |
|--------|----------------|---------------------------------|
| POST   | `/register`    | Register a new user.           |
| POST   | `/login`       | Login a user and receive a JWT token. |

### Game Routes
| Method | Endpoint          | Description                                             |
|--------|-------------------|---------------------------------------------------------|
| POST   | `/start`          | Start a new game in a created room (requires authentication). |
| POST   | `/move`           | Make a move during the game (requires authentication).  |
| POST   | `/finish`         | Mark a game as completed (requires authentication).     |
| GET    | `/history`        | Retrieve the logged-in user's match history.           |
| POST   | `/create-room`    | Create a new game room.                                 |
| POST   | `/join-room`      | Join an existing room using the room ID.               |
| POST   | `/add-opponent`   | Add an opponent to the room.                           |

---

## Socket.IO Communication
- WebSocket is used for real-time gameplay.
- Players in a room can send and receive updates for moves, turn changes, and game outcomes without page reloads.

---

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/Nimish2003/Tic-Tac-Toe

# Set Up the Backend
cd backend
npm install
npm start
# The backend will run at http://localhost:5000



# Set Up the Frontend
cd frontend
npm install
npm run dev
# The frontend will run at http://localhost:5173
