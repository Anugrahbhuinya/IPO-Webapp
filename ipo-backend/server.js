const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { redisClient, initializeRedisClient, getRedisStatus } = require("./config/redisClient");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Change this in production to restrict origins
    methods: ["GET", "POST"],
  },
});

// Make Socket.IO instance accessible via req.app.get("io")
app.set("io", io);

// Socket.IO connection handlers
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Add more event handlers if needed
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ipos", require("./routes/ipoRoutes"));
app.use("/api/brokers", require("./routes/brokerRoutes"));
app.use("/api/investors", require("./routes/investorRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/portfolio", require("./routes/portfolioRoutes"));
app.use("/api/ipos/sync", require("./routes/ipoRealTimeRoutes"));

app.get("/", (req, res) => {
  res.send("IPO App Backend Running");
});

const PORT = process.env.PORT || 5000;

(async () => {
  // Initialize Redis connection before starting server
  await initializeRedisClient();

  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
})();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Optionally close server and exit process
  // server.close(() => process.exit(1));
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing connections...");

  if (getRedisStatus() && redisClient) {
    try {
      await redisClient.quit();
      console.log("Redis client connection closed.");
    } catch (error) {
      console.error("Error closing Redis client:", error);
    }
  }

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });

  // Force shutdown after 10 seconds if still not closed
  setTimeout(() => {
    console.error("Forcing server shutdown...");
    process.exit(1);
  }, 10000);
});
