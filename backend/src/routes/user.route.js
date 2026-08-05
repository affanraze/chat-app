import { Router } from "express";
const router = Router();
// middleware-imports
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
// user-imports
import { loginUser, registerUser } from "../controllers/user.controller.js";
// message-imports

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, loginUser);

export default router;
