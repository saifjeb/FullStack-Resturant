import { Pool } from "pg";
import dotenv from "dotenv"
dotenv.config()

const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

pool
  .connect()
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => console.log("db error", err));

export default pool;