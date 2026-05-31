import Joi from "joi"
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/;

const registerSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.base": "Should be valid name",
        "string.min": "name must be at least 3 char",
        "any.required": "name must not be null"
    }),
    email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')).messages({
        "string.base": "Should be valid email",
        "any.required": "email must not be null",
        "string.pattern.base": "please enter a vlaid email, containes @ symbol and valid domain like .com"
    }),
    password: Joi.string()
        .min(8)
        .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,30}$/)
        .required()
        .label("Password")
        .messages({
            "string.min": "Password Must have at least 8 characters",
            "string.pattern.base": "Password must have at least 8 characters, and at least one symbol, one uppercase letter, one lowercase letter, and one number"
        }),

    confirmPassword: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Confirm password must match password",
            "any.required": "Confirm password is required",
        })
})

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email should be valid string",
        "string.email": "Email must be valid",
        "string.empty": "Email cannot be empty",
        "any.required": "Email Cant by empty"
    }),
    password: Joi.string().required().pattern(passwordRegex).min(8).max(100).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least 8 charecters',
        'string.max': 'Password must be at most 100 charecter',
        'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
        'any.required': 'Password is required'
    }),
})

export { registerSchema, loginSchema }