import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import adminRoutes from "./routes/admin.js";
import Car from "./models/car.js";
import Customer from "./models/customer.js";

const __dirname = import.meta.dirname;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

// Enable CORS for React frontend
app.use(cors());

//set up application template engine
app.set("views", path.join(__dirname, "views"));
//the second value above is the path: __dirname/views
app.set("view engine", "pug");

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

// Serve uploaded images from /uploads path
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/admin", adminRoutes);

// Simple test route
app.get("/ping", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Test route to check database connection and data
app.get("/test", async (req, res) => {
  try {
    const carCount = await Car.countDocuments();
    const customerCount = await Customer.countDocuments();

    res.json({
      message: "Database connected successfully!",
      data: {
        cars: carCount,
        customers: customerCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Serve React frontend as the main app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "car-rental-app.html"));
});

// Keep Pug admin dashboard on a different route (for backend management)
app.get("/admin-dashboard", (req, res) => {
  res.render("dashboard", { title: "Car Rentals Admin Dashboard" });
});

// Also serve React on /react route for compatibility
app.get("/react", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "car-rental-app.html"));
});

app.listen(port, () => {
  console.log(`🚗 Car Rentals app running at http://localhost:${port}`);
});
