import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { query } from "../utils/query.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { findUserByEmail, findUserByUserName } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { delFromCloudinary } from "../utils/delFromCloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ([email, username, password].some((field) => field?.trim() === 0)) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await query(
    "Select id FROM  users WHERE email = $1 OR username = $2",
    [email, username]
  );

  if (existedUser.rows.length > 0) {
    throw new ApiError(400, "User Name or email already exist");
  }
  const hash_password = await hashPassword(password);

  const user = await query(
    "INSERT INTO users (email,username,password) VALUES($1,$2,$3) RETURNING id,email,username,created_at",
    [email, username, hash_password]
  );

  if (user.rows.length === 0) {
    throw new ApiError(500, "failed to store data in db");
  }
  const accessToken = await generateAccessToken(user.rows[0]);
  const refreshToken = await generateRefreshToken(user.rows[0]);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, user.rows[0], "user registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const result = await query(
    "SELECT id,email,username,password FROM users WHERE email=$1 OR username=$2",
    [email, username]
  );

  if (result.rows.length === 0) {
    throw new ApiError(401, "unauthorised request");
  }

  const dbUser = result.rows[0];

  const isPasswordCorrect = await comparePassword(password, dbUser.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "invalid credentials");
  }

  const accessToken = await generateAccessToken(dbUser);
  const refreshToken = await generateRefreshToken(dbUser);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };

  await query("UPDATE users SET refresh_token = $1 WHERE id =$2", [
    refreshToken,
    dbUser.id,
  ]);

  const { password, ...user } = dbUser;

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, user, "user logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await query("UPDATE users SET refresh_token = null WHERE id=$1", [
    req.user.id,
  ]);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

const updatedProfileInfo = asyncHandler(async (req, res) => {
  const { email, username } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "username or email is required");
  }

  const updatedUser = await query(
    `
    UPDATE users
    SET
      email = COALESCE($1, email),
      username = COALESCE($2, username)
    WHERE id = $3
    RETURNING id, email, username;
    `,
    [email ?? null, username ?? null, req.user.id]
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser.rows[0],
        "user info updated successfully"
      )
    );
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Both fields are required");
  }

  const checkPassword = await comparePassword(
    currentPassword,
    req.user.password
  );

  if (!checkPassword) {
    throw new ApiError(400, "Password incorrect");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from current password"
    );
  }

  const hash_password = await hashPassword(newPassword);
  await query("UPDATE users SET password=$1 WHERE id=$2", [
    hash_password,
    req.user.id,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password updated successfully"));
});

const changeAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "failed to upload on cloudinary");
  }

  const dbUser = await query("SELECT avatar_publicid from users WHERE id =$1", [
    req.user.id,
  ]);

  try {
    const user = await query(
      "UPDATE users SET avatar=$1,avatar_publicid=$2 WHERE id =$3 RETURNING avatar",
      [avatar.url, avatar.public_id, req.user.id]
    );
  } catch (error) {
    await delFromCloudinary(avatar.public_id);
    throw new ApiError(500, "failed to change avatar");
  }

  const oldAvatarId = dbUser.rows[0].avatar_publicid;

  if (oldAvatarId) {
    try {
      await delFromCloudinary(oldAvatarId);
    } catch (error) {
      console.log(error);
    }
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        avatar: user.rows[0].avatar,
      },
      "avatar updated successfully"
    )
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  const decoded = await verifyRefreshToken(incomingRefreshToken);
  if (!decoded) {
    throw new ApiError(401, "invalid access");
  }

  const user = await query("SELECT id,refreshToken FROM users WHERE id =$1", [
    decoded.id,
  ]);
  if (!user) {
    throw new ApiError(401, "user doesnt exist");
  }

  if (user.rows[0].refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "unauthorized access");
  }

  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, {}, "access and refresh tokens refreshed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = {
    id: req.user.id,
    email: req.user.email,
    avatar: req.user.avatar,
    username: req.user.username,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, user, "current user fetched successfully"));
});

export { registerUser, refreshAccessToken };
