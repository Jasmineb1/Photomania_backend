import { Request, Response } from "express";
import { Post } from "../entity/posts.entity";
import { db } from "../datasource";
import { userService } from "./userAuthentication.service";
import { UserRegistration } from "../entity/user.entity";
const fs = require("fs");

const postRepository = db.getRepository(Post);

type TPost = {
  post_img: string;
  image_name: string;
  post_caption: string;
  post_desc: string;
  posted_at: Date;
  user_id: number;
};

async function createPost({
  post_img,
  image_name,
  post_caption,
  post_desc,
  posted_at,
  user_id,
}: TPost) {
  const user = await UserRegistration.findOne({ where: { id: user_id } });

  // check if the user exists ??

  const post = postRepository.create({
    post_img,
    image_name,
    post_caption,
    post_desc,
    posted_at,
    userRegistration: user,
  });
  await postRepository.save(post);
  return post;
}

async function listPost(post_id: number) {
  const post = await postRepository.findOne({ where: { post_id: post_id } });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

async function listPosts() {
  console.log("From service post");
  const posts = await postRepository.find();
  console.log("Post: ", posts);
  return posts;
}
// get posts by userId
async function userPosts(user_id) {
  const userpost = await postRepository.find({
    where: { userRegistration: { id: user_id } },
  });
  if (!userpost || userPosts.length === 0) {
    throw new Error("User doesnot have any posts!");
  }
  return userpost;
}

// delete userpostby postid
async function deleteUserPost(user_id, post_id) {
  const post = await postRepository.findOne({
    where: { post_id: post_id, userRegistration: { id: user_id } },
  });
  console.log(post);
  console.log(post.post_img);
  await postRepository.remove(post);
  const path = post.post_img;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
    }
  });
  return post;
}
// update user post by postid
async function updatePost(user_id, post_id, updatedPostData) {
  console.log(updatedPostData);
  const postToUpdate = await postRepository.findOne({
    where: { post_id, userRegistration: { id: user_id } },
  });

  if (!postToUpdate) {
    throw new Error("Post does not belong to the user!");
  }
  postRepository.merge(postToUpdate, updatedPostData);

  await postRepository.save(postToUpdate);

  return postToUpdate;
}

export const postService = {
  createPost,
  listPosts,
  listPost,
  userPosts,
  deleteUserPost,
  updatePost,
};
