// require('dotenv').config({path: './env'})
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { app } from "./app.js";

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

io.on("connection", (socket) => {
  console.log("a user is connected");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});
