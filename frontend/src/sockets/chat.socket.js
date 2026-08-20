import { io } from "socket.io-client";

let socket = null;

const createSocket = () => {
  const s = io("http://localhost:4000", {
    withCredentials: true,
  });
  s.on("connect", () => console.log("socket connected", s.id));
  s.on("connect_error", (err) =>
    console.error("socket connect_error:", err.message)
  );
  s.on("disconnect", (reason) => console.log("socket disconnected", reason));
  return s;
};

export const getSocket = () => {
  if (!socket) socket = createSocket();
  return socket;
};

export const connectSocket = () => getSocket();

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (payload) => {
  const s = getSocket();
  if (s.connected) s.emit("send-message", payload);
};

export { socket };