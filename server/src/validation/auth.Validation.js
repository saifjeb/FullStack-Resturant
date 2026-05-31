import joi from "joi"

const registerSchema = joi.object({
  name: joi
    .string()
    .min(3)
    .required()
    .messages({
      "string.base": "Name should be a valid text",
      "string.min": "Name must be at least 3 characters",
      "any.required": "Name is required",
    }),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": "Please enter a valid email",
      "string.email": "Please enter a valid email address",
      "any.required": "Email is required",
    }),
  password: joi
    .string()
    .min(8)
    .pattern(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
    .required()
    .messages({
      "string.min": "Password must have at least 8 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
      "any.required": "Password is required",
    }),
  confirmPassword: joi
    .any()
    .valid(joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password must match password",
      "any.required": "Confirm password is required",
    }),
})

export default registerSchema
