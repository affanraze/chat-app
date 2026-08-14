const InitializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("a user is connected", socket.id);
    socket.on("message", (m) => console.log(m));
    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });
};

export default InitializeSocket;
