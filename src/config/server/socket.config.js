import httpServer from "./http.config.js";

import logger from "../../utils/logger.js";

import { Server } from "socket.io";

const socketServer = new Server(httpServer, {
  cors: {
    origin: "https://manga-commerce-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

socketServer.on("connection", (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  socket.on("message", (data) => {
    fetch("https://mangacommercebackend-production.up.railway.app/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(({ data }) => {
        socket.broadcast.emit("message", data)
      })
      .catch((err) => {
        logger.error(err);
      });
  });

  socket.on("disconnect", () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

export default socketServer;
