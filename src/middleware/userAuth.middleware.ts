import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

type User = {
  user_id: number;
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
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, "secret", (err, user) => {
    console.log({ err });
    if (err) {
      return res.status(403).json({ err }); // Forbidden
    }
    req.user = user as User; // Attach the user object to the request
    console.log(user);
    next();
  });
}
