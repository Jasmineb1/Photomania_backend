import { postService } from "../services/postService";
import { Request, Response } from "express";
import { db } from "../datasource";
import { Post } from "../entity/posts.entity";
import { AuthenticatedRequest } from "../middleware/userAuth.middleware";
import { UserRegistration } from "../entity/user.entity";

const postRepository = db.getRepository(Post);

async function createPost(req: AuthenticatedRequest, res: Response) {
  console.log("From the controller file:", req.body);
  console.log("From the controller file:", req.file);
  console.log(req.user);

  try {
    const { post_caption, post_desc } = req.body;
    // const post_img = req.file.filename;
    const img = req.file;
    const post_img = img?.path as string;
    const image_name = req.file.originalname;
    // console.log(post_img);
    const posted_at = new Date();
    // console.log(posted_at)
    const userID = req.body.user_id;
    const user_id = req.user.user_id;
    const post_data = await postService.createPost({
      post_img,
      image_name,
      post_caption,
      post_desc,
      posted_at,
      user_id,
    });
    // console.log(post_data)
    res.status(201).json({
      status: "Success!",
      message: "Created",
      post_data,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed!",
      message: "Post Creation Failed!",
    });
  }
}

async function listPosts(req: Request, res: Response) {
  try {
    const postDetails = await postService.listPosts();
    // console.log("from cntroller ");
    res.status(200).json({
      status: "Fetched",
      message: "Details Fetched",
      postDetails,
    });
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
    const post_id = req.params.id;
    console.log("Post id here", post_id);
    const postData = await postService.listPost(post_id);
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
async function userPosts(req: AuthenticatedRequest, res: Response) {
  try {
    const user_id = req.user.user_id;
    // const user_id = req.user;
    console.log(user_id);

    const userPostdata = await postService.userPosts(user_id);
    if (!userPostdata) {
      res.status(204).json({
        status: "No content!",
        messgae: "User doesnot have any posts!",
      });
    }
    res.status(200).json({
      stauts: "Success!",
      message: "User data fetched!",
      userPostdata,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed!",
      message: "User post fetch failed",
    });
  }
}
// update userpost
async function updatePost(req: AuthenticatedRequest, res: Response) {
  try {
    console.log(req.body);
    const post_id = parseInt(req.params.id);
    const user_id = req.user.user_id;
    const image = req.file;
    const image_url = image?.path;
    const original_name = req.file.originalname;
    console.log(original_name);
    const { post_caption, post_desc } = req.body;
    console.log(post_caption, post_desc);
    const postData = await postService.updatePost(user_id, post_id, {
      image_url,
      original_name,
      post_caption,
      post_desc,
    });
    if (postData) {
      res.status(200).json({
        postData,
        status: "success!",
        message: "Post updated!",
      });
    }
  } catch (err) {
    console.log("Error updating information");
    res.status(304).json({
      status: "Not Modifi",
      message: "Updating data failed!",
      err,
    });
  }
}
// delete users posts
async function deletePost(req: AuthenticatedRequest, res: Response) {
  try {
    const post_id = req.params.id;
    const user_id = req.user.user_id;
    if (!user_id) {
      res.status(401).json({
        stauts: "unauthorized",
        message: "User not authenticated",
      });
    }
    const userPostDelete = await postService.deleteUserPost(user_id, post_id);

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
