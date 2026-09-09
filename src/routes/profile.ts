import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { userAuth } from '../middlewares/middleware.js';
import { User } from '../models/Schema.js';


const RequestRouterProfile = express.Router();

RequestRouterProfile.get("/profile/view",userAuth, async (req: Request, res: Response) => {
  try {
    res.send(req.user);
  } catch (err: any) { 
    res.status(400).send(err);
  }
});

RequestRouterProfile.patch("/profile/update",userAuth, async (req: Request, res: Response) => {
  const id = req.user;
  
  const body: Record<string, any> = req.body;

  if (!id) {
    return res.status(400).send("id is required"); 
  }

  const allowedUpdates: string[] = ["age", "gender","password","photoUrl","firstName","lastName","skills"];

  const invalidKeys: string[] = Object.keys(body).filter((key: string) => {
    return !allowedUpdates.includes(key);
  });

  if (invalidKeys.length > 0) {
    return res.status(400).send(`Invalid updates! You cannot update: ${invalidKeys.join(', ')}`);
  }

  try {
    const data = await User.findByIdAndUpdate(
      id,
      body,
      { returnDocument: 'after', runValidators: true }
    );
    res.status(200).json({
      message: "User updated successfully",
      data: data
    });
  } catch (err: any) { 
    res.status(400).send(err);
  }
});

export {RequestRouterProfile};