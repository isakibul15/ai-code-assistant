const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const { initSocket } = require("./socketServer");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const openaiRoutes = require("./routes/openaiRoutes");
app.use("/api", openaiRoutes);

const githubAuth = require("./routes/githubAuth");
app.use("/auth/github", githubAuth);

const githubRepos = require("./routes/githubRepos");
app.use("/api/github", githubRepos);

const githubCommit = require("./routes/githubCommit");
app.use("/api/github/commit", githubCommit);

// Start WebSocket
initSocket(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
