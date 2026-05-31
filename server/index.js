import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { registerController } from "./src/controller/auth.Controller.js"
import { validateRegister } from "./src/middleware/validate.Middleware.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.post("/register", validateRegister, registerController)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
