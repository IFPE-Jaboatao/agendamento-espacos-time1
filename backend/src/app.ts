import "dotenv/config";
import "reflect-metadata";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes";
import { AppDataSource } from "./data-source";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Adjust for production
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Specific rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later."
});

app.use(express.json());
app.use("/api", router);

// Apply auth limiter to auth routes
app.use("/api/auth/login", authLimiter);

AppDataSource.initialize()
  .then(() => console.log("Banco conectado"))
  .catch((err) => console.error("Erro ao conectar banco:", err));

export default app;