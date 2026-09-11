import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { userAuth } from '../middlewares/middleware.js';
import { User } from '../models/Schema.js';
import { ConnectionRequest } from '../models/ConnectionRequest.js';

const RequestRouterFeed = express.Router();

RequestRouterFeed.get("/feed", userAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    // 1. Pagination parameters
    const page: number = parseInt(req.query.page as string) || 1;
    let limit: number = parseInt(req.query.limit as string) || 10;
    
    limit = limit > 50 ? 50 : limit; 
    const skip = (page - 1) * limit;

    const swipeuserid = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id }, 
        { toUserId: user._id }
      ],
    }).select("fromUserId toUserId");
   
    const hiddenUsers = new Set<string>();
    
    swipeuserid.forEach((swipe) => {
      hiddenUsers.add(swipe.fromUserId.toString());
      hiddenUsers.add(swipe.toUserId.toString());
    });

    const swipeusers = await User.find({
      $and: [
        { _id: { $ne: user._id } },
        { _id: { $nin: Array.from(hiddenUsers) } },
      ],
    })
      .select("firstName lastName skills age aboutMe photoUrl gender")
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      page,
      limit,
      data: swipeusers,
    });

  } catch (err: any) {
    res.status(400).json({ message: "Error loading feed: " + err.message });
  }
});


export {RequestRouterFeed};