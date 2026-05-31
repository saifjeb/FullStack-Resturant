import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./src/routes/auth.Routes.js"

dotenv.config()
const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Server is running")
})

app.use("/api", authRoutes)

const port = process.env.PORT || 3030
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
