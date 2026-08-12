import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
app.use(cors(process.env.CORS_ORIGIN));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);
export { app };
// http://localhost:4000/api/v1/users/register
