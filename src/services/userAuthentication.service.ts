import { Request, Response } from "express";
// import { UserRegistration } from "../entity/user.entity";
// import { db } from "../datasource";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// const express = require("expresss");
// const { Request, Response } = express;
const { UserRegistration } = require("../entity/user.entity");
const { db } = require("../datasource");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = db.getRepository(UserRegistration);

async function registerUser({
  username,
  email,
  password,
  firstName,
  lastName,

  registeredOn,
}: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  registeredOn: Date;
}) {
  const user = userRepository.create({
    username,
    email,
    password,
    firstName,
    lastName,
    registeredOn,
  });
  await userRepository.save(user);
  return user;
}

// user login
async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  // const inputhashedpw= await bcrypt.hash(req.body.password, 10);
  // console.log(inputhashedpw)
  const checkUser = await userRepository.findOne({ where: { email: email } });
  console.log(checkUser);
  if (checkUser) {
    const hashedPassword = checkUser.password;
    const passwordMatch = await bcrypt.compare(password.trim(), hashedPassword);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          userId: checkUser.id,
        },
        "secret",
        { expiresIn: "1d" }
      );
      console.log("Token from service:", token);
      console.log("userid from service:", checkUser.id);
      let obj = {
        userName: checkUser.username,
        token: token,
        message: "login successful!",
      };
      return obj;
    }
  } else {
    let obj = {
      user: null,
      token: null,
      message: "Login unsuccessful!",
    };
    return obj;
  }
}

// User profile
async function userProfile(userId) {
  const userProfile = await userRepository.findOne({
    where: { id: userId },
    relations: ["posts"],
  });
  console.log(userProfile);
  if (!userProfile) {
    throw new Error("User doesnot exist");
  }
  return userProfile;
}
export const userService = {
  registerUser,
  login,
  userProfile,
};
