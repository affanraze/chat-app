import { verifyAccessToken } from "../utils/jwt.js";
import { query } from "../utils/query.js";

const onlineUsers = new Map();

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")];
    })
  );
};

const emitToUser = (io, userId, event, payload) => {
  onlineUsers
    .get(userId)
    ?.forEach((socketId) => io.to(socketId).emit(event, payload));
};

const InitializeSocket = (io) => {
  io.use((socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies.accessToken;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = verifyAccessToken(token);
      socket.data.userId = decoded.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    console.log("user connected", userId, socket.id);

    socket.on("send-message", async ({ receiverId, content, tempId } = {}) => {
      if (!receiverId || !content?.trim()) return;
      if (userId === receiverId) return;

      try {
        const message = await query(
          "INSERT INTO messages (sender_id,receiver_id,content) VALUES($1,$2,$3) RETURNING id,content,created_at,sender_id,receiver_id",
          [userId, receiverId, content.trim()]
        );

        if (message.rows.length === 0) return;

        const msg = message.rows[0];
        const payload = {
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          createdAt: msg.created_at,
          tempId,
        };

        emitToUser(io, userId, "message", payload);
        emitToUser(io, receiverId, "message", payload);
      } catch (error) {
        console.error("send-message error", error);
      }
    });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) onlineUsers.delete(userId);
      }
      console.log("user disconnected", userId, socket.id);
    });
  });
};

export default InitializeSocket;
