import { NextFunction, Request, Response } from "express";

// import jwt from "jsonwebtoken";

const jwt = require("jsonwebtoken");

type User = {
  userId: number;
};

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware function to verify the bearer token and extract user
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "secret", (err, user) => {
    // console.log({ err });
    if (err) {
      return res.status(403).json({ err });
    }
    req.user = user as User;
    console.log("Logging user:", req.user);
    next();
  });
}
