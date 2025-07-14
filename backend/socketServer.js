// backend/socketServer.js
const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // OPTIONAL: Join a room (default: 'global')
    const room = socket.handshake.query.room || "global";
    socket.join(room);
    console.log(`📁 Joined room: ${room}`);

    // Listen for code changes and broadcast to room
    socket.on("code:update", (data) => {
      socket.to(room).emit("code:update", data); // emit to others in the room
    });

    // OPTIONAL: Leave room manually if needed
    socket.on("leave-room", () => {
      socket.leave(room);
      console.log(`🚪 Left room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}

module.exports = { initSocket };
