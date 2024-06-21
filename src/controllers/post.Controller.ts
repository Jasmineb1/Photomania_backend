// import { postService } from "../services/postService";
import { Request, Response } from "express";
// import { db } from "../datasource";
// import { Post } from "../entity/posts.entity";
// import { AuthenticatedRequest } from "../middleware/userAuth.middleware";
// import { UserRegistration } from "../entity/user.entity";

const { postService } = require("../services/postService");
const { db } = require("../datasource");
const { Post } = require("../entity/posts.entity");
const { AuthenticatedRequest } = require("../middleware/userAuth.middleware");
const { UserRegistration } = require("../entity/user.entity");

const postRepository = db.getRepository(Post);

async function createPost(req: typeof AuthenticatedRequest, res: Response) {
  console.log("From the controller file:", req.body);
  console.log("Uploaded file:", req.file);
  console.log(req.user);

  try {
    const { postCaption, postDesc } = req.body;

    const img = req.file;
    const postImg = img?.path as string;
    const imageName = req.file.originalname;

    const postedAt = new Date();

    const userId = req.user.userId;
    const postData = await postService.createPost({
      postImg,
      imageName,
      postCaption,
      postDesc,
      postedAt,
      userId,
    });

    res.status(201).json({
      status: "Success!",
      message: "Created",
      // postData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "Failed!",
      message: "Post Creation Failed!",
    });
  }
}

async function listPosts(req: Request, res: Response) {
  try {
    const page = Number(req.query.page);

    const limit = Number(req.query.limit);

    // const postDetails = await postService.listPosts(page, limit);
    const { posts, count } = await postService.listPosts(page, limit);

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: "Fetched",
      message: "Details Fetched",
      currentPage: page,
      totalPages: totalPages,
      posts: posts,
    });

    // console.log(totalPages);
  } catch (err) {
    res.status(204).json({
      status: "No content",
      message: "Failed!",
    });
    console.log(err);
  }
}

async function listPost(req: Request<{ id: number }>, res: Response) {
  try {
    const postId = req.params.id;
    console.log("Post id here", postId);
    const postData = await postService.listPost(postId);
    console.log(postData);
    res.status(200).json({
      status: "Success!",
      messgae: "Fetcahed data!",
      postData,
    });
  } catch (err) {
    res.status(204).json({
      status: "No content",
      message: "Post not found!",
    });
  }
}

// get post by userId
async function userPosts(req, res) {
  console.log(req.params.id);
  console.log("From controller:", req.params.id);

  try {
    const userId = req.params.id;
    console.log("Controller ko try block:", userId);
    const userPostdata = await postService.userPosts(userId);
    console.log(userPostdata);

    if (userPostdata.length === 0) {
      return res.send({
        status: "No content!",
        message: "User does not have any posts!",
      });
    }

    return res.status(200).json({
      status: "Success!",
      message: "User data fetched!",
      userPostdata,
    });
  } catch (err) {
    console.error("Error in userPosts controller:", err);
    return res.status(500).json({
      status: "Failed!",
      message: "User post fetch failed",
    });
  }
}

// update userpost
async function updatePost(req: typeof AuthenticatedRequest, res: Response) {
  try {
    console.log(req.body);
    const postId = parseInt(req.params.id);

    const userId = req.user.userId;

    // const image = req.file;
    // const imageUrl = image?.path;
    // const originalName = req.file.originalname;

    const { postCaption, postDesc } = req.body;
    console.log(postCaption, postDesc);
    const postData = await postService.updatePost(userId, postId, {
      // imageUrl,
      // originalName,
      postCaption,
      postDesc,
    });

    if (postData) {
      res.status(200).json({
        // postData,
        status: "success!",
        message: "Post updated!",
      });
    }
  } catch (err) {
    console.log("Error updating information");
    res.status(304).json({
      status: "Not Modified",
      message: "Updating data failed!",
      err,
    });
  }
}
// delete users posts
async function deletePost(req: typeof AuthenticatedRequest, res: Response) {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({
        stauts: "unauthorized",
        message: "User not authenticated",
      });
    }
    const userPostDelete = await postService.deleteUserPost(userId, postId);

    if (!userPostDelete) {
      res.status(204).json({
        status: "No content",
        message: "Post not found",
        userPostDelete,
      });
    }
    res.status(200).json({
      stauts: "Success!",
      messgae: "User post deleted!",
    });
  } catch (err) {
    res.status(304).json({
      status: "Not modified!",
      message: "Post delete failed!",
      err,
    });
  }
}

export const postController = {
  createPost,
  listPosts,
  listPost,
  userPosts,
  updatePost,
  deletePost,
};
