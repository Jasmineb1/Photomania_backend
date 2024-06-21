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
    const existingUserName = await userregRepository.findOne({
      where: { username: username },
    });
    console.log(email);
    console.log(existingUser);
    if (existingUser) {
      res.status(401).json({
        status: "Failed",
        message: "User already exists!",
      });
    } else {
      if (existingUserName) {
        res.status(401).json({
          status: "Failed",
          message: "Username exists!",
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

    console.log("From controller:", userId);

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

  console.log("Result:", result);
  if (result.message === "Incorrect Password!") {
    return res.status(401).json({
      status: "Not authorized!",
      message: "Invalid password!",
    });
  }
  if (result.message === "User does not exist!") {
    return res.status(404).json({
      status: "Failed!",
      message: "User does not exist!",
    });
  }
  console.log("From the controller:", result);
  res.status(200).json(result);
}

// update user data
async function updateUser(req: typeof AuthenticatedRequest, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const id = req.user.userId;

    const image = req.file;

    const imageUrl = image?.path;
    const originalName = image?.originalname;

    const { firstName, lastName, about } = req.body;

    const userData = await userService.updateUser(userId, {
      firstName,
      lastName,
      about,
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

// remove user photo
async function deleteUserPhoto(
  req: typeof AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = parseInt(req.params.id, 10);
    const authenticatedUserId = req.user.userId;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not authorized to delete this photo",
      });
    }

    const userData = await userService.deleteUserPhoto(userId);

    if (userData) {
      res.status(200).json({
        userData,
        status: "success!",
        message: "User photo deleted!",
      });
    } else {
      res.status(400).json({
        status: "Bad Request",
        message: "User photo deletion failed!",
      });
    }
  } catch (err) {
    console.error("Error deleting user photo:", err);
    res.status(500).json({
      status: "Internal Server Error",
      message: "Failed to delete user photo!",
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
  deleteUserPhoto,
};
