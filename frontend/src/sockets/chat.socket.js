import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

socket.on("connect", () => console.log("socket connected", socket.id));
socket.on("disconnect", () => console.log("socket disconnected"));

const sendMessage = (payload) => socket.emit("send-message", payload);

export { socket, sendMessage };
