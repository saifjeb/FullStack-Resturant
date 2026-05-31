import jwt from "jsonwebtoken"
import { register, saveRefreshTokens } from "../models/auth.Model.js"
import { getUserByEmail, getUserById } from "../models/user.Model.js"
import bcrypt from "bcrypt"
import { generateAccessTokens, generateRefreshTokens } from "../utils/tokens.Utils.js"

export const registerController = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
        const isExist = await getUserByEmail(email);
        if (isExist) {
            return res.status(400).json({ message: "Email already exit" });
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const user = await register(name, email, hashed_password);
        return res.status(201).json({ message: "Registered Successfully", user });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        //search the user email in db
        const isExist = await getUserByEmail(email);
        if (!isExist) {
            return res.status(404).json({ message: "Could not fund user" });
        }
        //check the password 
        const isMatch = await bcrypt.compare(password, isExist.hashed_password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Password or Email ar not correct" });
        }
        //generate access (short age) and refresh(long age) tokens 
        const accessTokens = generateAccessTokens(isExist)
        const refreshTokens = generateRefreshTokens(isExist)
        //hashing refresh tokens
        const hashedRefresh = await bcrypt.hash(refreshTokens, 10)
        //save hashed refresh tokens in db
        await saveRefreshTokens(isExist.id, hashedRefresh)
        //save refreshTokens in cookie
        res.cookie("refreshTokens", refreshTokens, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.cookie(
            "user",
            {
                id: isExist.id,
                email: isExist.email,
            },
            {
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            }
        );
        return res
            .status(200)
            .json({
                message: "Login successfully", accessTokens, user: {
                    id: isExist.id,
                    email: isExist.email,
                    name: isExist.name,
                    role: isExist.role,
                    created_at: isExist.created_at
                },
            });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refreshToken = async (req, res) => {
    try {
        //get refresh tokens from cookies
        const refreshToken = req.cookies.refreshTokens
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh Tokens" })
        }
        //verifying the refresh tokens
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
        //get user by id
        const user = await getUserById(decoded.id)
        //if user exist
        if (!user) {
            return res.status(404).json({ message: "User not found!" })
        }
        //compare between the found refresh token, and the refresh token in db
        const valid = await bcrypt.compare(refreshToken, user.refreshTokens)
        if (!valid) {
            return res.status(403).json({ message: "Invalid refresh tokens" })
        }
        //new refresh tokens and new access tokens 
        const accessToken = generateAccessTokens(user)
        const newRefresh = generateRefreshTokens(user)
        //hashing refresh tokens 
        const newHashRefresh = await bcrypt.hash(newRefresh, 10)
        //store in db
        await saveRefreshTokens(user.id, newHashRefresh)
        //store in cookies
        res.cookie("refreshToken", newRefresh, {
            maxAge: 30 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        return res.json({ accessToken })
    } catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}