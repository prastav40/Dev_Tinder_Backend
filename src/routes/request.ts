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


RequestRouterRequest.get("/user/requests/pendingrequests", userAuth, async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId", 
      "firstName lastName skills age about"
    );

    res.status(200).json({
      message: "Data fetched successfully",
      data: pendingRequests,
    });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

RequestRouterRequest.post("/user/requests/:accept_notaccept/:personuserid", userAuth, async (req: Request, res: Response) => {
    const decideresult = req.params.accept_notaccept as string;
    const touserid = req.params.personuserid as string;
    const loggedInUser = req.user._id;

    const allowedDecisions = ["accepted", "rejected"];

    if (!allowedDecisions.includes(decideresult)) {
        return res.status(400).send("Invalid decision value. Allowed values are 'accepted' or 'rejected'.");
    }

    try {
        const selectedresult = await ConnectionRequest.findOne({
            fromUserId: touserid,
            toUserId: loggedInUser,
            status: "interested"
        });

        if (!selectedresult) {
            return res.status(404).send("No pending request found from this user.");
        }
            
        selectedresult.status = decideresult as "accepted" | "rejected";
        await selectedresult.save();
        
        res.status(200).send("Request processed successfully.");
    } catch (error) {
        res.status(500).send("An error occurred while processing the request.");
    }
});

RequestRouterRequest.get("/user/connections", userAuth, async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName skills age about")
      .populate("toUserId", "firstName lastName skills age about");

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId; 
      }
      return row.fromUserId;  
    });

    res.status(200).json({ data });

  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export { RequestRouterRequest }; 