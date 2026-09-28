import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { userAuth } from '../middlewares/middleware.js';
import { User } from '../models/Schema.js';

import { upload } from "../config/cloudinaryConfig.js"; // wherever you export it from


const RequestRouterProfile = express.Router();

RequestRouterProfile.get("/profile",userAuth, async (req: Request, res: Response) => {
  try {
    res.send(req.user);
  } catch (err: any) { 
    res.status(400).send(err);
  }
});


RequestRouterProfile.patch("/profile/update", userAuth, async (req: Request, res: Response) => {
  const id = req.user._id;
  const body: Record<string, any> = req.body;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  const allowedUpdates: string[] = ["age", "gender", "photoUrl", "photoId", "firstName", "lastName", "skills"];
  const invalidKeys: string[] = Object.keys(body).filter((key: string) => !allowedUpdates.includes(key));

  if (invalidKeys.length > 0) {
    return res.status(400).json({ message: `Invalid updates! You cannot update: ${invalidKeys.join(", ")}` });
  }

  try {
    const data = await User.findByIdAndUpdate(id, body, { returnDocument: "after", runValidators: true });
    res.status(200).json({ message: "User updated successfully", data });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Update failed" });
  }
});

RequestRouterProfile.post(
  "/profile/upload-photo",
  userAuth,
  upload.single("photo"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // with CloudinaryStorage, multer has already uploaded the file by this point
      res.status(200).json({
        message: "Photo uploaded successfully",
        url: req.file.path,        // Cloudinary's secure_url
        photoId: req.file.filename, // Cloudinary's public_id
      });
    } catch (err: any) {
      res.status(500).json({ message: "Upload failed", error: err.message });
    }
  }
);

export {RequestRouterProfile};