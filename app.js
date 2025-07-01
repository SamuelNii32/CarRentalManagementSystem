import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import adminRoutes from "./routes/admin.js";

const __dirname = import.meta.dirname;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

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

app.get("/", (req, res) => {
  res.render("dashboard", { title: "Car Rentals Admin Dashboard" });
});

app.listen(port, () => {
  console.log(`🚗 Car Rentals app running at http://localhost:${port}`);
});
