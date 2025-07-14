// lib/socket.ts
import { io } from "socket.io-client";

// 🔄 You can dynamically pass `room=my-room-id` if needed
const socket = io("http://localhost:8080", {
  query: {
    room: "room-1", // replace with dynamic room if needed
  },
});

export default socket;
