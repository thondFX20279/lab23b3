import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const verifyToken = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("not authenticated");
    error.status = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodeToken;

  try {
    decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.status = 500;
    next(error);
  }
  if (!decodeToken) {
    const error = new Error("Not authorized");
    error.status = 401;
    next(error);
  }
  req.userId = decodeToken.userId;
  next();
};
export default verifyToken;
