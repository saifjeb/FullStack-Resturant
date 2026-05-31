import pool from "../config/db.js"

export const register = async (name, email, hashed_password) => {
  const result = await pool.query(
    `INSERT INTO users(name, email, hashed_password) VALUES($1, $2, $3) RETURNING *`,
    [name, email, hashed_password]
  )
  return result.rows[0]
}

export const saveRefreshTokens = async (userId, refreshToken) => {
  const result = await pool.query(
    `UPDATE users SET refreshTokens = $1 WHERE id = $2 RETURNING *`,
    [refreshToken, userId]
  )
  return result.rows[0]
}

