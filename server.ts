import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Socket.io Logic for Multiplayer Coding Battles
  const rooms = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId, displayName }) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { players: [] });
      }
      const room = rooms.get(roomId);
      if (room.players.length < 2) {
        room.players.push({ id: socket.id, userId, displayName });
        io.to(roomId).emit("room-update", room.players);
      }
    });

    socket.on("code-update", ({ roomId, code }) => {
      socket.to(roomId).emit("remote-code-update", code);
    });

    socket.on("submit-code", ({ roomId, userId, result }) => {
      io.to(roomId).emit("battle-result", { userId, result });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // Handle room cleanup logic here
    });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
