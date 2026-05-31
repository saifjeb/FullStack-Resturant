import jwt from "jsonwebtoken"

const accessSecret = process.env.ACCESS_SECRET || "access_secret"
const refreshSecret = process.env.REFRESH_SECRET || "refresh_secret"

export const generateAccessTokens = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    accessSecret,
    { expiresIn: "15m" }
  )
}

export const generateRefreshTokens = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    refreshSecret,
    { expiresIn: "30d" }
  )
}
