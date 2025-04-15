const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const Game = require("./GameSchema");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const environment = process.env.NODE_ENV || "development";
if (environment === "development") {
  require("dotenv").config();
}

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Tic Tac Toe Server");
});


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join-room", async (props) => {
    try {
      const players = await handleRoom(props);
      socket.join(props.roomId);

      if (Object.keys(players).length === 2) {
        io.to(props.roomId).emit("setPlayer", players);
      }

      socket.on("make-move", (data) => {
        io.to(data.roomId).emit("move-made", {
          turn: data.turn,
          pos: data.pos,
        });

        const p = data.posArr;

        const winningCombos = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];

        if (data.turn >= 4) {
          for (const [a, b, c] of winningCombos) {
            if (p[a] && p[a] === p[b] && p[a] === p[c]) {
              io.to(data.roomId).emit("gameFinished", { winner: p[a] });
              return;
            }
          }

          if (data.turn >= 9) {
            io.to(data.roomId).emit("gameFinished", { winner: -1 }); // Draw
          }
        }
      });

      socket.on("reset-game", (data) => {
        const { roomId } = data;
        resetRoomGameState(roomId);
      });

      socket.on("disconnect", () => {
        io.to(props.roomId).emit("playerLeft", { err: "Player Left" });
        console.log("Client disconnected");
      });

    } catch (err) {
      console.error("Join-room error:", err);
    }
  });
});

// Function to reset the game state for a specific room
async function resetRoomGameState(roomId) {
  try {
    const room = await Game.findOne({ roomId: roomId });
    if (room) {
      const resetPos = Array(9).fill(null);
      const resetTurn = 0;

      // Broadcast the reset game state to all players in the room
      io.to(roomId).emit("gameReset", {
        message: "Game has been reset",
        pos: resetPos,
        turn: resetTurn,
      });

      console.log(`Game in room ${roomId} has been reset.`);
    } else {
      console.log(`Room with ID ${roomId} not found`);
    }
  } catch (err) {
    console.error("Error resetting room:", err);
  }
}

// Room Handling
async function handleRoom(props) {
  const room = await Game.findOne({ roomId: props.roomId });
  const userEntry = { [props.userId]: props.user };

  if (!room) {
    const newRoom = new Game({ roomId: props.roomId, users: userEntry });
    await newRoom.save();
  } else if (Object.keys(room.users).length < 2) {
    const updatedUsers = { ...room.users, ...userEntry };
    await Game.updateOne({ roomId: props.roomId }, { users: updatedUsers });
  }

  const updatedRoom = await Game.findOne({ roomId: props.roomId });
  return updatedRoom.users;
}

// 🔊 Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
