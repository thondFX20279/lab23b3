import Post from "../model/post.js";
import fs from "fs";

import User from "../model/user.js";
import path from "path";
import { validationResult } from "express-validator";
import socketSever from "../socket.js";
export const getPosts = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = 2;
    const totalItems = await Post.countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Fetched posts successfully.",
      posts,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const image = req.file;
    if (!image) {
      const imageError = new Error("image can not be empty");
      imageError.status = 422;
      throw imageError;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ message: "validation failed, data is not correct ", errors: errors.array() });
    const imageUrl = "images/" + image.filename;
    const newPost = new Post({ title, content, imageUrl, creator: req.userId });
    const user = await User.findById(req.userId);
    user.posts.push(newPost);
    socketSever
      .getIO()
      .emit("post", { action: "create", post: { ...newPost._doc, creator: { _id: user._id, name: user.name } } });
    await user.save();
    await newPost.save();
    res
      .status(201)
      .json({ message: "create post success", post: newPost, creator: { _id: user._id, name: user.name } });
  } catch (error) {
    next(error);
  }
};
export const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("No post found");
      error.status = 401;
    }
    res.status(200).json({ message: "fetch success", post: post });
    // res.status(200).json({ message: "Fetched posts successfully.", posts: posts });
  } catch (error) {
    next(error);
  }
};
export const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content, image } = req.body;
    const imageUrl = req.file || image;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ message: "validation failed, data is not correct ", errors: errors.array() });
    if (!imageUrl) {
      const imageError = new Error("image can not be empty");
      imageError.status = 422;
      throw imageError;
    }
    console.log(req.userId);
    console.log("a");

    const post = await Post.findById(postId).populate("creator");
    console.log(post.creator._id);

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }
    if (!post) {
      const error = new Error("No post found");
      error.status = 404;
      next(error);
    }
    if (req.file && "images/" + req.file.filename !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = req.file ? `images/${req.file.filename}` : image;
    await post.save();
    socketSever.getIO().emit("post", { action: "update", post });
    res.status(201).json({ message: "update post success", post: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("No post found");
      error.status = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized");
      error.status = 401;
      throw error;
    }
    clearImage(post.imageUrl);
    const user = await User.findById(req.userId);
    await user.posts.pull(post._id);
    await user.save();
    await Post.findByIdAndDelete(postId);
    socketSever.getIO().emit("post", { action: "delete", post: postId });
    res.status(201).json({ message: "delete post success" });
  } catch (error) {
    next(error);
  }
};

const clearImage = function (imagePath) {
  fs.unlinkSync(path.join(__dirname, "..", imagePath), (err) => {
    console.log(err);
  });
};
