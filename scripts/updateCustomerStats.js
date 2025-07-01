// scripts/updateCustomerStats.js

import mongoose from "mongoose";
import dotenv from "dotenv";

import Customer from "../models/customer.js";
import Rental from "../models/rental.js";

dotenv.config();
// 1. Connect to MongoDB
mongoose.connect(
  "mongodb+srv://samuelnii6000:wr6JExAT6W4TFCcj@carrentalcluster.clfz62s.mongodb.net/?retryWrites=true&w=majority&appName=CarRentalCluster",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function updateCustomerStats() {
  try {
    const customers = await Customer.find();

    for (const customer of customers) {
      const rentals = await Rental.find({ customer: customer._id });

      const totalRentals = rentals.length;
      const totalSpent = rentals.reduce(
        (sum, r) => sum + (r.totalAmount || 0),
        0
      );

      await Customer.findByIdAndUpdate(customer._id, {
        totalRentals,
        totalSpent,
      });

      console.log(
        `Updated ${
          customer.name
        }: Rentals = ${totalRentals}, Spent = $${totalSpent.toFixed(2)}`
      );
    }

    console.log("✅ Customer stats updated!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error updating stats:", err);
    mongoose.connection.close();
  }
}

updateCustomerStats();
