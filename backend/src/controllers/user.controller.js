import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { query } from "../utils/query.js";
import { hashPassword } from "../utils/bcrypt.js";
import { comparePassword } from "../utils/bcrypt.js";
import { findUserByEmail } from "../models/user.model.js";
import { findUserByUserName } from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.js";
import { generateRefreshToken } from "../utils/jwt.js";

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
    "INSERT INTO users (email,username,hash_password) VALUES($1,$2,$3) RETURNING id,email,username,created_at",
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
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, user.rows[0], "user registered successfully"));
});

export { registerUser };
