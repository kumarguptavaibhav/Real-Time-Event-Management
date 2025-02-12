import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/routes.js";
import errorHandler from "./middleware/errorhandlermiddleware.js";
import helmet from "helmet";
import compression from "compression";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch((err) => {
  console.error("Database connection failed:", err.message);
  process.exit(1); // Exit process if DB fails
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined event ${eventId}`);
    io.to(eventId).emit("attendeeUpdate", { eventId });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running successfully!" });
});

app.use("/user", router);

app.use(errorHandler);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io, server };
