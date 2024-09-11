import express from "express";
import * as controllers from "../controller/index.js";
import expressValidate from "express-validator";
import User from "../model/user.js";
import verifyToken from "../middleware/verify-token.js";
const routes = express.Router();
const { body } = expressValidate;
routes.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value, { req }) => {
        const isExistAccount = await User.findOne({ email: value });

        if (isExistAccount) {
          throw new Error("Email address already exists");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().notEmpty(),
  ],
  controllers.signup
);
routes.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  controllers.login
);

routes.get("/status", verifyToken, controllers.getStatus);
routes.patch("/status", [body("status").trim().notEmpty()], verifyToken, controllers.updateStatus);

export default routes;
