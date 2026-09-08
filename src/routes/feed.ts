import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { userAuth } from '../middlewares/middleware.js';
import { user } from '../models/Schema.js';

const RequestRouterFeed = express.Router();

RequestRouterFeed.get("/feed",userAuth, async (req: Request, res: Response) => {
  try {
    const userdata = await user.find({});
    res.send(userdata);
    console.log(req.user);
  } catch (err: any) { 
    res.status(400).send(err);
  }
});


export {RequestRouterFeed};