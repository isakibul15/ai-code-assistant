// src/lib/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // adjust if your server is on a different port

export default socket;
