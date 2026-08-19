import api from "./api";

const HUES = [
  "#8b7fff",
  "#f2789f",
  "#5ec8d8",
  "#f2b25c",
  "#9ad86e",
  "#e26b6b",
];

export const hueFor = (name = "") => {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return HUES[sum % HUES.length];
};

export const formatTime = (iso) => {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const day = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round((day(now) - day(date)) / 86400000);
  if (diff === 0) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (diff === 1) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "long" });
};

export const formatMessageTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const mapConversation = (c) => ({
  id: c.id,
  name: c.username,
  avatar: c.avatar,
  last: c.last_message,
  time: formatTime(c.last_message_at),
  unread: 0,
  online: false,
  hue: hueFor(c.username),
});

export const userToContact = (u) => ({
  id: u.id,
  name: u.username,
  avatar: u.avatar,
  last: "",
  time: "",
  unread: 0,
  online: false,
  hue: hueFor(u.username),
});

export const fetchConversations = async () => {
  const { data } = await api.get("/api/v1/messages/my-convo");
  return data.data.map(mapConversation);
};