import jwt from "jsonwebtoken";
import { query } from "../utils/query.js";

const verifyJWT = async (req, res, next) => {

    try {

        const token =
            req.cookies.accessToken ||
            req.header("Authorization")
                ?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const result = await query(
            "SELECT * FROM users WHERE id=$1",
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = result.rows[0];

        next();

    } catch (err) {

        res.status(401).json({
            message: "Invalid token",
        });

    }

};

export default verifyJWT;