import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { userAuth } from '../middlewares/middleware.js';
import { User } from '../models/Schema.js';
import { ConnectionRequest } from '../models/ConnectionRequest.js';

const RequestRouterFeed = express.Router();

RequestRouterFeed.get("/feed",userAuth,async (req: Request, res: Response, next: NextFunction) => {
    const user=req.user;
    const swipeuserid=await ConnectionRequest.find({$or:[{fromUserId:user._id},{toUserId:user._id}]}).select("fromUserId toUserId");
   
    const hiddenUsers = new Set<string>();
    
    swipeuserid.forEach((swipe)=>{
      hiddenUsers.add(swipe.fromUserId.toString());
      hiddenUsers.add(swipe.toUserId.toString());
    });

    const swipeusers=await User.find({
      $and:[
        {_id:{$ne:user._id}},
        {_id:{$nin:Array.from(hiddenUsers)}}
      ]
    }).select("firstName lastName skills age aboutMe photoUrl gender").limit(10);
    
    res.status(200).send(swipeusers);
})


export {RequestRouterFeed};