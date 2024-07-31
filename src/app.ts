import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();

// USE HELMET AND CORS MIDDLEWARES
app.use(
  cors({
    origin: ["*"], // Comma separated list of your urls to access your api. * means allow everything
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging HTTP requests
app.use(morgan("tiny"));

// Define your routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

export default app;
