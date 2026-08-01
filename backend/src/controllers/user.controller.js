import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { query } from "../utils/query.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { findUserByEmail, findUserByUserName } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

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

const updateUserProfileInfo = asyncHandler(async (req, res) => {
  const {} = req.body;
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

export { registerUser };
