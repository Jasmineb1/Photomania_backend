import { validationResult } from "express-validator";
import { postController } from "../controllers/post.Controller";
import { userController } from "../controllers/userAuthentication.controller";
import { loginValidator, registerValidator } from "../middleware/formValidator";
import { authenticateToken } from "../middleware/userAuth.middleware";
const express = require("express");
const userRegisterRouter = express.Router();
const userLoginRouter = express.Router();
const userLogoutRouter = express.Router();

userRegisterRouter.post(
  "/",
  registerValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  userController.registerUSer
);

userLoginRouter.post(
  "/",
  loginValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  userController.login
);

userLogoutRouter.get("/", authenticateToken, userController.logout);

export const userRoutes = {
  userRegisterRouter,
  userLoginRouter,
  userLogoutRouter,
};
