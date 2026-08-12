import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  return (
    <>
      <h1>socket.io connection</h1>
    </>
  );
}

export default App;
