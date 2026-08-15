const InitializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("a user is connected", socket.id);
    socket.on("user-message", (text) => {
      io.emit("msg", text);
    });
    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
};

export default InitializeSocket;
