import { userService } from "../services/userAuthentication.service";
import { Request, Response } from "express";
import { UserRegistration } from "../entity/user.entity";
import { db } from "../datasource";
import bcrypt from "bcryptjs";

const userregRepository = db.getRepository(UserRegistration);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function registerUSer(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const registered_on = new Date();
    const existingUser = await userregRepository.findOne({
      where: { email: email },
    });
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
          registered_on,
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
  res.status(200).json(result);
}

export const userController = {
  registerUSer,
  login,
};
