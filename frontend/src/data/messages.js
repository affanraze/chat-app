// Placeholder data — swap this for messages coming from your websocket connection.
const DUMMY_MESSAGES = [
  {
    id: 1,
    mine: false,
    text: "hey, pushed the socket server changes",
    time: "2:10 pm",
  },
  {
    id: 2,
    mine: false,
    text: "check the reconnect logic when you get a sec",
    time: "2:11 pm",
  },
  { id: 3, mine: true, text: "on it, pulling now", time: "2:14 pm" },
  {
    id: 4,
    mine: true,
    text: "looks clean so far, testing multi-tab",
    time: "2:15 pm",
  },
  {
    id: 5,
    mine: false,
    text: "sent the api docs, check ws.js",
    time: "2:27 pm",
  },
];

export default DUMMY_MESSAGES;
