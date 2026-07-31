import { query } from "../utils/query";

export const findUserByEmail = async (email) => {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);

  return result.rows[0];
};

export const findUserByUserName = async (username) => {
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
};

export const findUserById = async (id) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
};
