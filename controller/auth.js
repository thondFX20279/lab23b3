import { validationResult } from "express-validator";
import User from "../model/user";
import bcryptjs from "bcryptjs";
import generateAccessToken from "../middleware/generate_token";
export const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      throw error;
    }
    const { email, password, name } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });

    await user.save();
    res.status(201).json({ message: "sign up success", userId: user._id });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      throw error;
    }
    const { email, password } = req.body;
    const account = await User.findOne({ email });
    if (!account) {
      const error = new Error("Email or password not true");
      error.status = 401;
      throw error;
    }
    const isValidAccount = await bcryptjs.compare(password, account.password);
    if (!isValidAccount) {
      const error = new Error("Email or password not true");
      error.status = 401;
      throw error;
    }
    const token = generateAccessToken({ email: account.email, userId: account._id });
    res.status(200).json({ message: "login success", userId: account._id, token });
  } catch (error) {
    next(error);
  }
};

export const getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Not authorized");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      message: "get status success",
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Not authorized");
      error.status = 404;
      throw error;
    }
    const { status } = req.body;
    user.status = status;
    await user.save();
    res.status(200).json({
      message: "update status success",
      status: user.status,
    });
  } catch (error) {
    next(error);
  }
};
