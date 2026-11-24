const { Pool } = require("pg");
if (!process.env.DATABASE_URL) console.error("DATABASE_URL is missing. Add it to .env.");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined
});
pool.on("error", err => console.error("Database pool error:", err));
module.exports = pool;
