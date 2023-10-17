const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// API routes
const userRoutes = require("./routes/userRoutes");
const formRoutes = require("./routes/formRoutes");
const { connectDB } = require("./config/db");

// Connect to the database before starting the server
connectDB()
  .then(() => {
    app.use(cors()); // Enable CORS for all routes
    app.use(express.json());

    // Set up your API routes
    app.use("/api/users", userRoutes);
    app.use("/api/forms", formRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

// Close the database connection when the application is terminated
process.on("SIGINT", () => {
  closeDB();
  process.exit();
});
