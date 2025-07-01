import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  rating: { type: Number, min: 0, max: 5, default: 5 },
  status: {
    type: String,
    enum: ["Active", "VIP", "New"],
    default: "Active",
  },
  joinedAt: { type: Date, default: Date.now },
  totalRentals: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastRentalDate: { type: Date },
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
