import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { query } from "../utils/query.js";

const sendMessage = asyncHandler(async (req, res) => {
  const sendersId = req.user.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    throw new ApiError(400, "receivers id and content is required");
  }

  if (senderId === receiverId) {
    throw new ApiError(400, "You cannot message yourself");
  }

  const message = await query(
    "INSERT INTO messages (sender_id,receiver_id,content) VALUES($1,$2,$3) RETURNING id,content,created_at,sender_id,receiver_id",
    [sendersId, receiverId, content.trim()]
  );

  if (message.rows.length === 0) {
    throw new ApiError(500, "failed to deliver message");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(201, message.rows[0], "message delivered successfully")
    );
});
