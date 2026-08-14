// require('dotenv').config({path: './env'})
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { app } from "./app.js";
import InitializeSocket from "./sockets/chat.socket.js";

dotenv.config({
  path: "./.env",
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

InitializeSocket(io);

server.listen(process.env.PORT, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});
