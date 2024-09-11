import { Router } from "express";
import { body } from "express-validator";
import upload from "../middleware/file_upload.js";
import * as controllers from "../controller/index.js";

import verifyToken from "../middleware/verify-token.js";
const routes = Router();
routes.get("/posts", verifyToken, controllers.getPosts);
routes.post(
  "/post",
  upload.single("image"),
  [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })],
  verifyToken,
  controllers.createPost
);
routes.get("/post/:postId", controllers.getPost);
routes.put(
  "/post/:postId",
  upload.single("image"),
  [body("title").trim().isLength({ min: 5 }), body("content").trim().isLength({ min: 5 })],
  verifyToken,
  controllers.updatePost
);
routes.delete("/post/:postId", verifyToken, controllers.deletePost);
export default routes;
