import pool from "../config/db.js";

export const query = (text, params) => {
    return pool.query(text, params);
};

// how to user it

// import { query } from "../utils/query.js";

// const result = await query(
//     "SELECT * FROM users"
// );