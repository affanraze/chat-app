import { Router } from "express";
const router = Router();
// middleware-imports
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
// user-imports
import {
  changeAvatar,
  getCurrentUser,
  getUserByUserName,
  loginUser,
  refreshAccessToken,
  registerUser,
  updatedProfileInfo,
  updateUserPassword,
} from "../controllers/user.controller.js";
// message-imports

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, loginUser);
router.route("/update-profile-info").patch(verifyJWT, updatedProfileInfo);
router.route("/update-password").patch(verifyJWT, updateUserPassword);
router
  .route("/update-avatar")
  .patch(upload.single("avatar"), verifyJWT, changeAvatar);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/get-user/:username").get(getUserByUserName);

export default router;
