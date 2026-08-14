import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatApp from "./pages/ChatApp.jsx";
import { io } from "socket.io-client";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useEffect } from "react";

function App() {
  const socket = io("http://localhost:4000");
  useEffect(() => {
    socket.emit("message", "hello world");
  }, []);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/chat"
        element={
          <ThemeProvider>
            <ChatApp />
          </ThemeProvider>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
