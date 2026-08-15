import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ChatApp from "./pages/ChatApp.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoutes from "./utils/ProtectedRout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/chat"
          element={
            <ThemeProvider>
              <ChatApp />
            </ThemeProvider>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
