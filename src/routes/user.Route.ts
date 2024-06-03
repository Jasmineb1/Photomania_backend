import { postController } from "../controllers/post.Controller";
import { userController } from "../controllers/userAuthentication.controller";
const express = require("express");
const user_register_router = express.Router();
const user_login_router = express.Router();

user_register_router.post("/", userController.registerUSer);

user_login_router.post("/", userController.login);

export const user_routes = {
  user_register_router,
  user_login_router,
};
