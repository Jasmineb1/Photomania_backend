// import { validationResult } from "express-validator";
import { postController } from "../controllers/post.Controller";
import { postValidator } from "../middleware/formValidator";
import { upload } from "../middleware/imageUpload.middleware";
import { authenticateToken } from "../middleware/userAuth.middleware";

const express = require("express");
const postRouter = express.Router();
const userPostRouter = express.Router();
const { validationResult } = require("express-validator");
postRouter.post(
  "/",

  authenticateToken,
  upload.single("image"),
  postValidator,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  postController.createPost
);

//get post by postid
postRouter.get("/:id", postController.listPost);
//get posts of a specific user by userid
userPostRouter.get("/", authenticateToken, postController.userPosts);
userPostRouter.delete("/:id", authenticateToken, postController.deletePost);
userPostRouter.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  postController.updatePost
);

export const postRoutes = { postRouter, userPostRouter };
