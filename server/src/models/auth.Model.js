import pool from "../config/db.js"

export const register = async (name, email, hashed_password) => {
  const result = await pool.query(
    `INSERT INTO users(name, email, hashed_password) VALUES($1, $2, $3) RETURNING *`,
    [name, email, hashed_password]
  )
  return result.rows[0]
}

