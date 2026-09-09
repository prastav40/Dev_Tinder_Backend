import mongoose, { Document, Schema } from "mongoose";

// 1. Define the TypeScript Interface for strict typing
export interface IConnectionRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: "ignored" | "interested" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

// 2. Pass the interface into the Schema
const connectionRequestSchema = new Schema<IConnectionRequest>({
  fromUserId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  toUserId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["ignored", "interested", "accepted", "rejected"],
    required: true
  }
}, { timestamps: true });

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export const ConnectionRequest = mongoose.model<IConnectionRequest>(
  "ConnectionRequest", 
  connectionRequestSchema
);