import express from "express"
import { validate } from "../middleware/validate.Middleware.js"
import { registerSchema, loginSchema } from "../validation/auth.Validation.js"
import { loginController, refreshToken, registerController } from "../controller/auth.Controller.js"
const route = express.Router()

route.post('/auth/register', validate(registerSchema), registerController)
route.post('/auth/login', validate(loginSchema), loginController)
route.post('/auth/refresh', refreshToken)

export default route