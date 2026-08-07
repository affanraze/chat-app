import { Router } from "express";
const router = Router();

// middleware-imports
import verifyJWT from "../middlewares/auth.middleware.js";
// message imports
import {
  getConversationMessages,
  getMyConversations,
  sendMessage,
} from "../controllers/message.controller.js";
// Apply verifyJWT to ALL routes defined below this line
router.use(verifyJWT);

router.route("/send-message").post(sendMessage);
router.route("/get-convo/:receiverId").get(getConversationMessages);
router.route("/my-convo").get(getMyConversations);

export default router;
