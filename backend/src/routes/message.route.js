import { Router } from "express";
const router = Router();

// middleware-imports
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
// message imports
import { sendMessage } from "../controllers/message.controller.js";

router.route("/send-message").post(verifyJWT, sendMessage);

export default router;
