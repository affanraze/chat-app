import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on("connect", () => {
    console.log("Connected to the PostgreSQL database");
});

pool.on("error", (err) => {
    console.error("Error in PostgreSQL connection pool", err);
});

// it will make connection to the db as soon as i make a query req

export {pool};