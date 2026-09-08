import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { user } from "../models/Schema.js";

declare global {
  namespace Express {
    interface Request {
      user?: any; 
    }
  }
}

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decodedMessage = jwt.verify(token, "PRASTAV") as { _id: string };
    const { _id } = decodedMessage;

    const targetUser = await user.findById(_id);
    if (!targetUser) {
      throw new Error("User not found");
    }

    req.user = targetUser; 
    next();
  } catch (err: any) {
    res.status(401).send("Unauthorized: " + err.message);
  }
};

