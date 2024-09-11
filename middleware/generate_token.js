import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();
const generateAccessToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" });
export default generateAccessToken;
