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

const getConversationMessages = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;

  if (!receiverId) {
    throw new ApiError(400, "receivers id is required");
  }

  const messages = await query(
    "SELECT id,sender_id,receiver_id,content,created_at FROM messages WHERE (sender_id =$1 AND receiver_id =$2) OR (sender_id =$2 AND receiver_id =$1) ORDER BY created_at ASC",
    [req.user.id, receiverId]
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, messages.rows, "all messages fetched successfully")
    );
});

const getMyConversation = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const chatData = await query(
    `SELECT DISTINCT ON (
      CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
      END
  )
      u.id,
      u.username,
      u.avatar,
      m.id AS message_id,
      m.content,
      m.created_at
  FROM messages m
  JOIN users u
  ON u.id =
  CASE
      WHEN m.sender_id = $1 THEN m.receiver_id
      ELSE m.sender_id
  END
  WHERE m.sender_id = $1
     OR m.receiver_id = $1
  ORDER BY
      CASE
          WHEN m.sender_id = $1 THEN m.receiver_id
          ELSE m.sender_id
      END,
      m.created_at DESC`,
    [userId]
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, chatData.rows, "chat data fetched successfully")
    );
});

export { sendMessage, getConversationMessages, getMyConversation };
