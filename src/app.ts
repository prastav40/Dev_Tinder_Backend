import { connectDB } from './config/Database.js';
import express, { type Express } from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { RequestRouterauth } from './routes/auth.js';
import { RequestRouterProfile } from "./routes/profile.js";
import { RequestRouterFeed } from './routes/feed.js';
import { RequestRouterRequest } from './routes/request.js';

const app: Express = express();
const port: number = 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", RequestRouterauth);
app.use("/", RequestRouterProfile);
app.use("/", RequestRouterFeed);
app.use("/", RequestRouterRequest);

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();