import express from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import router from "./routes/routes.js";
import errorHandler from "./middleware/errorhandlermiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(morgan("dev"));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined event ${eventId}`);
    io.to(eventId).emit("attendeeUpdate", { eventId });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use("/user", router);
app.use(errorHandler);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io, server };
