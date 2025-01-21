const rooms = new Map(); // Store active game rooms

const setupWebSocket = (wss) => {
    wss.on("connection", (ws) => {
        console.log("New player connected!");

        ws.on("message", (data) => {
            const message = JSON.parse(data);

            if (message.type === "create_room") {
                const roomId = Date.now().toString();
                rooms.set(roomId, { players: [ws], moves: [] });
                ws.send(JSON.stringify({ type: "room_created", roomId }));
                console.log(`Room created: ${roomId}`);
            }

            if (message.type === "join_room") {
                const room = rooms.get(message.roomId);
                if (room && room.players.length < 2) {
                    room.players.push(ws);
                    room.players.forEach((player) => {
                        player.send(JSON.stringify({ type: "game_start", roomId: message.roomId }));
                    });
                    console.log(`Player joined room: ${message.roomId}`);
                } else {
                    ws.send(JSON.stringify({ type: "error", message: "Room is full or doesn't exist" }));
                }
            }

            if (message.type === "make_move") {
                const room = rooms.get(message.roomId);
                if (room) {
                    room.moves.push({ player: message.player, position: message.position });
                    room.players.forEach((player) => {
                        player.send(JSON.stringify({ type: "move_made", position: message.position, player: message.player }));
                    });
                    console.log(`Move in room ${message.roomId}: Player ${message.player} -> Position ${message.position}`);
                }
            }
        });

        ws.on("close", () => console.log("Player disconnected"));
    });
};

export default setupWebSocket;
