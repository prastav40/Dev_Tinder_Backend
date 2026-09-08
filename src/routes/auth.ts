import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { user } from "../models/Schema.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

const RequestRouterauth = express.Router();

interface LoginRequestBody {
  email?: string;
  password?: string;
}

RequestRouterauth.post("/signup", async (req: Request, res: Response) => {
  const data = new user(req.body);
  try {
    await data.save();
    res.send("user saved successfully")
  } catch (err: any) { 
    res.status(400).send(err);
  }
});


RequestRouterauth.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const existingUser = await user.findOne({ email });
    
    if (!existingUser) {
      return res.status(401).send("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password as string);

    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ _id: existingUser._id }, "PRASTAV", {
      expiresIn: "7d",
    });
    
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).send("Login successful!");

  } catch (err: any) {
    res.status(400).send(err.message);
  }
});


export { RequestRouterauth }; 