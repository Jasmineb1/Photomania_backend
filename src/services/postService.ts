// import { Post } from "../entity/posts.entity";
// import { db } from "../datasource";
// import { userService } from "./userAuthentication.service";
// import { UserRegistration } from "../entity/user.entity";
const { Post } = require("../entity/posts.entity");
const { db } = require("../datasource");
const { UserRegistration } = require("../entity/user.entity");
const fs = require("fs");

const postRepository = db.getRepository(Post);

type TPost = {
  postImg: string;
  imageName: string;
  postCaption: string;
  postDesc: string;
  postedAt: Date;
  userId: number;
};

async function createPost({
  postImg,
  imageName,
  postCaption,
  postDesc,
  postedAt,
  userId,
}: TPost) {
  const user = await UserRegistration.findOne({ where: { id: userId } });

  // check if the user exists ??

  const post = postRepository.create({
    postImg,
    imageName,
    postCaption,
    postDesc,
    postedAt,
    userRegistration: user,
  });
  console.log("Here at service");
  console.log("post image", postImg);
  await postRepository.save(post);
  return post;
}

async function listPost(postId: number) {
  const post = await postRepository.findOne({
    where: { postId: postId },
    relations: ["userRegistration"],
  });
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
}

async function listPosts(page: number, limit: number) {
  // console.log((page - 1) * limit);
  // console.log("From service post");
  // const posts = await postRepository.find();
  const [posts, count] = await postRepository.findAndCount({
    order: {
      postedAt: "DESC",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  return { posts, count };
}
// get posts by userId
async function userPosts(userId) {
  console.log("From services:", userId);
  const userpost = await postRepository.find({
    where: { userRegistration: { id: userId } },
  });

  if (!userpost || userpost.length === 0) {
    console.log("No posts of user");
  }

  return userpost;
}

// delete userpostby postid
async function deleteUserPost(userId, postId) {
  const post = await postRepository.findOne({
    where: { postId: postId, userRegistration: { id: userId } },
  });
  console.log(post);
  console.log(post.postImg);
  await postRepository.remove(post);
  const path = post.postImg;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
    }
  });
  return post;
}
// update user post by postid
async function updatePost(userId, postId, updatedPostData) {
  console.log(updatedPostData);
  console.log("reached service");
  const postToUpdate = await postRepository.findOne({
    where: { postId, userRegistration: { id: userId } },
  });
  console.log("post to update", postToUpdate);

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
