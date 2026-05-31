import bcrypt from "bcrypt"
import { getUserByEmail } from "../models/user.Model.js"
import { register } from "../models/auth.Model.js"
import { isDbConnected } from "../config/db.js"

export const registerController = async (req, res) => {
  if (!isDbConnected()) {
    return res.status(503).json({ message: "Database unavailable. Please try again later." })
  }

  const { name, email, password } = req.body

  try {
    const isExist = await getUserByEmail(email)
    if (isExist) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashed_password = await bcrypt.hash(password, 10)
    const user = await register(name, email, hashed_password)

    return res.status(201).json({ message: "Registered Successfully", user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
