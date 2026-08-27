import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

//Middlewares
import errorMiddleware from "./middlewares/error.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";

//Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL|| "http://localhost:5173",
}));
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorMiddleware);



app.use("/api/auth", authRoutes);
app.use("/api/users",userRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Interview API is running",
  });
});


export default app;