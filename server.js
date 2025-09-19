const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const tasksRoutes = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" })); // Body parsing with size limit

// Routes
app.use("/api/tasks", tasksRoutes);

app.get("/", (req, res) => {
  res.json({ 
    message: "✅ Node.js Express API is running...",
    version: "1.0.0",
    endpoints: {
      tasks: "/api/tasks"
    }
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app; // For testing
