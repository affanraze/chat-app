import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { connectSocket, disconnectSocket } from "../sockets/chat.socket.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/api/v1/users/me");
        if (!mounted) return;
        setUser(data.data);
        setStatus("authenticated");
      } catch {
        if (!mounted) return;
        setUser(null);
        setStatus("unauthenticated");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [status]);

  const login = async (credentials) => {
    const { data } = await api.post("/api/v1/users/login", credentials);
    setUser(data.data);
    setStatus("authenticated");
  };

  const register = async (payload) => {
    const { data } = await api.post("/api/v1/users/register", payload);
    setUser(data.data);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/users/logout");
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  const updataAvatar = async (avatarFile) => {
    const { data } = await api.patch("/api/v1/users/update-avatar", avatarFile);
    setUser((prev) => (prev ? { ...prev, avatar: data.data.avatar } : prev));
    return data;
  };

  const updateInfo = async (info) => {
    const { data } = await api.patch("/api/v1/users/update-profile-info", info);
    setUser((prev) => (prev ? { ...prev, ...data.data } : prev));
    return data;
  };

  const findUser = async (username) => {
    const { data } = await api.get(`/api/v1/users/get-user/${username}`);
    return data.data;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        login,
        register,
        updataAvatar,
        updateInfo,
        logout,
        findUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
