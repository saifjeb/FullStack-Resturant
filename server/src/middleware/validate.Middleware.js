import registerSchema from "../validation/auth.Validation.js"

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false })
  if (error) {
    const errors = error.details.map((detail) => detail.message)
    return res.status(400).json({ errors })
  }
  next()
}

