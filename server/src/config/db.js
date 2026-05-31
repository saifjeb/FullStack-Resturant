import { Pool } from "pg"
import dotenv from "dotenv"
dotenv.config()

const connectionString = process.env.CONNECTION_STRING
if (!connectionString) {
  console.error("Missing CONNECTION_STRING in server/.env")
}

const pool = new Pool({
  connectionString,
})

let connected = false

const connectDb = async () => {
  if (!connectionString) return

  try {
    await pool.connect()
    connected = true
    console.log("db is connected")
  } catch (err) {
    console.error("Database connection failed:", err.message)
  }
}

connectDb()

export const isDbConnected = () => connected
export default pool
