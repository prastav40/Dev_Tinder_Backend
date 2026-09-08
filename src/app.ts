import express, { type Express} from 'express';
import { connectDB } from './config/Database.js';
import cookieParser from "cookie-parser";
import { RequestRouterauth } from './routes/auth.js';
import {RequestRouterProfile} from "./routes/profile.js"
import { RequestRouterFeed } from './routes/feed.js';

const app: Express = express();
const port: number = 3000;


app.use(express.json());
app.use(cookieParser());

app.use("/",RequestRouterauth)
app.use("/",RequestRouterProfile)
app.use("/",RequestRouterFeed)

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();