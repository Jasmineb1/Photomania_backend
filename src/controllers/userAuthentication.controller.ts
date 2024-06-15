import { userService } from "../services/userAuthentication.service";
import { Request, Response } from "express";
import { UserRegistration } from "../entity/user.entity";
import { db } from "../datasource";
import bcrypt from "bcryptjs";

const userregRepository = db.getRepository(UserRegistration);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registerUSer(req: Request, res: Response) {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
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

async function login(req: Request, res: Response) {
  const result = await userService.login(req, res);
  console.log("From the controller:", result);
  res.status(200).json(result);
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
};
