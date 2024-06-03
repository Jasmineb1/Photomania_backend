import { postController } from "../controllers/post.Controller";
import { upload } from "../middleware/imageUpload.middleware";
import { authenticateToken } from "../middleware/userAuth.middleware";

const express = require("express");
const post_router = express.Router();
const userPostRouter = express.Router();

post_router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  postController.createPost
);

//get post by postid
post_router.get("/:id", postController.listPost);
//get posts of a specific user by userid
userPostRouter.get("/", authenticateToken, postController.userPosts);
userPostRouter.delete("/:id", authenticateToken, postController.deletePost);
userPostRouter.put(
  "/:id",
  authenticateToken,
  upload.single("image"),
  postController.updatePost
);

export const postRoutes = { post_router, userPostRouter };
