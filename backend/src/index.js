// require('dotenv').config({path: './env'})
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user is connected");
});

server.listen(process.env.PORT, () => {
  console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
});
