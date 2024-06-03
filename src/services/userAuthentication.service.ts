import { Request, Response } from "express";
import { UserRegistration } from "../entity/user.entity";
import { db } from "../datasource";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = db.getRepository(UserRegistration);

async function registerUser({
  username,
  email,
  password,
  registered_on,
}: {
  username: string;
  email: string;
  password: string;
  registered_on: Date;
}) {
  const user = userRepository.create({
    username,
    email,
    password,
    registered_on,
  });
  await userRepository.save(user);
  return user;
}

// user login
async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  // const inputhashedpw= await bcrypt.hash(req.body.password, 10);
  // console.log(inputhashedpw)
  const check_user = await userRepository.findOne({ where: { email: email } });
  if (check_user) {
    const hashedPassword = check_user.password;
    const passwordMatch = await bcrypt.compare(password.trim(), hashedPassword);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          user_id: check_user.id,
        },
        "secret",
        { expiresIn: "1d" }
      );
      let obj = {
        userName: check_user.username,
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

export const userService = {
  registerUser,
  login,
};
