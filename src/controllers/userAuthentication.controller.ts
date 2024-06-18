// import { userService } from "../services/userAuthentication.service";
import { Request, Response } from "express";
// import { UserRegistration } from "../entity/user.entity";
// import { db } from "../datasource";
// import bcrypt from "bcryptjs";

const { userService } = require("../services/userAuthentication.service");
const { UserRegistration } = require("../entity/user.entity");
const { db } = require("../datasource");
const bcrypt = require("bcryptjs");
const { AuthenticatedRequest } = require("../middleware/userAuth.middleware");
const userregRepository = db.getRepository(UserRegistration);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registerUSer(req: Request, res: Response) {
  console.log(req.body);
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const registeredOn = new Date();
    const existingUser = await userregRepository.findOne({
      where: { email: email },
    });
    console.log(email);
    console.log(existingUser);
    if (existingUser) {
      res.status(401).json({
        status: "Failed",
        message: "User already exists!",
      });
    } else {
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "Failed",
          message: "Invalid email format",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
        const data = await userService.registerUser({
          username,
          email,
          password: hashedPassword,
          registeredOn,
          firstName,
          lastName,
        });
        res.status(201).json({
          status: "success",
          message: "User Creation Success!",
        });
      }
    }
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({
      status: "error",
      message: "Could not create a user",
    });
  }
}

async function userProfile(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    console.log(userId);

    const userdata = await userService.userProfile(userId);

    res.status(200).json({
      status: "Success!",
      message: "User data fetched!",
      userdata,
    });
  } catch (err) {
    if (err.message === "User does not exist") {
      return res.status(204).json({
        status: "No content!",
        message: "User does not exist",
      });
    }

    console.error("Error fetching user profile:", err);
    res.status(500).json({
      status: "Failed!",
      message: "User data fetch failed",
    });
  }
}
async function login(req: Request, res: Response) {
  const result = await userService.login(req, res);
  console.log("From the controller:", result);
  res.status(200).json(result);
}

async function updateUser(req: typeof AuthenticatedRequest, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const id = req.user.userId;

    const image = req.file;
    const imageUrl = image?.path;
    console.log(imageUrl);
    const originalName = req.file.originalname;
    console.log(imageUrl);
    console.log(originalName);
    const { firstName, lastName } = req.body;

    const userData = await userService.updateUser(userId, {
      firstName,
      lastName,
      imageUrl,
      originalName,
    });

    if (userData) {
      res.status(200).json({
        userData,
        status: "success!",
        message: "User data updated!",
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "User data update failed!",
      });
    }
  } catch (err) {
    console.error("Error updating user information:", err);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Failed to update user data!",
      error: err.message,
    });
  }
}

async function logout(req: Request, res: Response) {
  // console.log("logout api hit");
  return res.status(200).json({
    status: "Success",
    message: "logout successful",
  });
}
export const userController = {
  registerUSer,
  login,
  logout,
  userProfile,
  updateUser,
};
