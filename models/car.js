import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
  name: String,
  year: Number,
  registrationNumber: String,
  type: String,
  fuel: String,
  seats: Number,
  pricePerDay: Number,
  imageUrl: String,
  available: { type: Boolean, default: true },
});

const Car = mongoose.model("Car", CarSchema);

export default Car;
