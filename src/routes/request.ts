import express, { type Request, type Response } from 'express';
import { ConnectionRequest } from "../models/ConnectionRequest.js"; 
import { userAuth } from "../middlewares/middleware.js";

const RequestRouterRequest = express.Router();

RequestRouterRequest.post("/request/send/:status/:touserid", userAuth, async (req: Request, res: Response) => {
     const fromUserId = req.user._id;
     const toUserId = req.params.touserid as string;
     const status= req.params.status as string;

     const allowedStatus = ["ignored", "interested"];

     if(!allowedStatus.includes(status)){
           return res.status(400).send("Invalid status value. Allowed values are 'ignored' or 'interested'.");
     }

     if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).json({ message: "You cannot swipe on yourself!" });
    }

    try{
        const newRequest = new ConnectionRequest({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        });
        
        await newRequest.save();
        res.status(201).send("Request sent successfully.");
    }catch(error){
        res.status(500).send("An error occurred while sending the request.");
    }
});

export { RequestRouterRequest }; 