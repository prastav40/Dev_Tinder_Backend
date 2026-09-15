import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { User } from "../models/Schema.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { upload } from '../config/cloudinaryConfig.js';

const RequestRouterauth = express.Router();

interface LoginRequestBody {
  email?: string;
  password?: string;
}

RequestRouterauth.post("/signup", upload.single("photo"), async (req: Request, res: Response) => {
  try {
    // 1. Extract the standard text fields from req.body
    const { email, password, firstName, lastName, age, gender, skills } = req.body;

    // 2. Extract the Cloudinary URL attached by the multer middleware
    const photoUrl = req.file ? req.file.path : undefined;

    // 3. FormData sends arrays as strings, so we must parse it back into a JavaScript array
    const parsedSkills = skills ? JSON.parse(skills) : [];

    // 4. Construct the user object manually with the correct data types
    const data = new User({
      email,
      password, // Ensure your Mongoose schema has a pre-save hook to hash this!
      firstName,
      lastName,
      age: parseInt(age),
      gender,
      skills: parsedSkills,
      photoUrl
    });

    await data.save();
    
    // Send a 201 Created status along with the user data
    res.status(201).send(data);
  } catch (err: any) { 
    res.status(400).send({ message: err.message || "Signup failed" });
  }
});


RequestRouterauth.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const existingUser = await User.findOne({ email });
    
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

    res.status(200).send(existingUser);

  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

RequestRouterauth.post("/logout", async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful!" });
  } catch (err: any) {
    res.status(400).json({ message: "Something went wrong: " + err.message });
  }
});


export { RequestRouterauth }; 