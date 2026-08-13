import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import HomePage from "./pages/Landing-page";
import SignupPage from "./pages/Signup-page";
import LoginPage from "./pages/Login-page";
const socket = io("http://localhost:4000");

function App() {
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("Connected to Socket.IO:", socket.id);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected");
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("disconnect");
  //   };
  // }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
