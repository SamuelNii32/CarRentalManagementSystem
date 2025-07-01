import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },

  bookingId: {
    type: String,
    required: true,
    unique: true,
  },

  dailyRate: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Upcoming",
      "Active",
      "Confirmed",
      "Completed",
      "Overdue",
      "Cancelled",
    ],
    default: "Upcoming",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);
export default Rental;
