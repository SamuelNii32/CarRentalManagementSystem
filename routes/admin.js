import express from "express";
import multer from "multer";
import path from "path";
import Car from "../models/car.js";
import Customer from "../models/customer.js";
import Rental from "../models/rental.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({ storage });

// Route: List all cars
router.get("/vehicles", async (req, res) => {
  const cars = await Car.find().sort({ year: -1 });
  res.render("cars", { title: "Manage Cars", cars, activePage: "vehicles" });
});

// Route: Show vehicle form
router.get("/vehicles/new", (req, res) => {
  res.render("car-form", { title: "Add New Car" });
});

// Route: Handle vehicle form submission with image upload
router.post("/vehicle", upload.single("image"), async (req, res) => {
  try {
    const carData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      available: req.body.available === "true",
    };

    await Car.create(carData);
    res.redirect("/admin/vehicles");
  } catch (error) {
    res.status(500).send("Error adding vehicle: " + error.message);
  }
});

// Get single vehicle data by ID (for editing)
router.get("/vehicle/:id", async (req, res) => {
  try {
    const vehicle = await Car.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update existing vehicle
router.put("/vehicle/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    delete updateData._id;

    const updatedVehicle = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedVehicle) return res.status(404).send("Vehicle not found");

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Error updating vehicle: " + error.message);
  }
});

// DELETE vehicle by ID
router.delete("/vehicle/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Check if any rentals are using this vehicle
    const rentalCount = await Rental.countDocuments({ vehicle: id });

    if (rentalCount > 0) {
      return res
        .status(400)
        .send("Cannot delete vehicle: It has associated rentals.");
    }

    const deleted = await Car.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).send("Vehicle not found");
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Error deleting vehicle: " + error.message);
  }
});

function getStatusBadgeClass(status) {
  switch (status) {
    case "VIP":
      return "badge-vip";
    case "Active":
      return "badge-active";
    case "New":
      return "badge-new";
    default:
      return "badge-active";
  }
}

// List all the customers with rentals stats
router.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });

    // Step 1: Calculate summary stats for dashboard
    const totalCustomers = await Customer.countDocuments();
    const vipCustomers = await Customer.countDocuments({ status: "VIP" });
    const newCustomersThisMonth = await Customer.countDocuments({
      joinDate: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    const avgRatingAgg = await Customer.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = avgRatingAgg[0]
      ? avgRatingAgg[0].avgRating.toFixed(1)
      : "N/A";

    // Step 2: Add rental stats to each customer
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const rentals = await Rental.find({ customer: customer._id }).sort({
          startDate: -1,
        });

        const totalRentals = rentals.length;
        const totalSpent = rentals.reduce(
          (sum, rental) => sum + rental.totalAmount,
          0
        );
        const lastRental = rentals[0];
        const cleanName = customer.name.replace(/\s+/g, " ").trim();

        return {
          ...customer.toObject(),
          name: cleanName,
          totalRentals,
          totalSpent,
          lastRentalFormatted: lastRental
            ? new Date(lastRental.startDate).toISOString().substring(0, 10)
            : "N/A",
        };
      })
    );

    // Step 3: Render the view
    res.render("customers", {
      title: "Customer Management",
      activePage: "customers",
      customers: customersWithStats,
      getStatusBadgeClass,
      totalCustomers,
      vipCustomers,
      newCustomersThisMonth,
      avgRating,
    });
  } catch (err) {
    res.status(500).send("Error loading customers: " + err.message);
  }
});

// New customer form
router.get("/customers/new", (req, res) => {
  res.render("customer-form", { title: "Add New Customer" });
});

// Add customer form submission
router.post("/customers", async (req, res) => {
  try {
    await Customer.create(req.body);
    res.redirect("/admin/customers");
  } catch (error) {
    res.status(500).send("Error adding customer: " + error.message);
  }
});

// Show edit customer form (server-rendered)
router.get("/customers/:id/edit", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found");
    res.render("customer-form", { title: "Edit Customer", customer });
  } catch (error) {
    res.status(500).send("Error loading customer: " + error.message);
  }
});

// Handle edit customer form submission (server-rendered)
router.post("/customers/:id", async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/customers");
  } catch (error) {
    res.status(500).send("Error updating customer: " + error.message);
  }
});

// Handle customer deletion (server-rendered)
router.post("/customers/:id/delete", async (req, res) => {
  try {
    const customerId = req.params.id;

    // Check if customer has any rentals
    const rentalCount = await Rental.countDocuments({ customer: customerId });
    if (rentalCount > 0) {
      return res
        .status(400)
        .send("Cannot delete customer: They have associated rentals.");
    }

    await Customer.findByIdAndDelete(customerId);
    res.redirect("/admin/customers");
  } catch (error) {
    res.status(500).send("Error deleting customer: " + error.message);
  }
});
//  API endpoint: Get single customer data by ID (JSON)**
router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// API endpoint for all vehicles (JSON)
router.get("/api/vehicles", async (req, res) => {
  try {
    const cars = await Car.find().sort({ year: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// API endpoint for all customers (JSON)
router.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// List all the rentals
router.get("/rentals", async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("vehicle")
      .populate("customer")
      .sort({ startDate: -1 });

    const validRentals = rentals.filter((r) => r.customer && r.vehicle);

    const customers = await Customer.find().sort({ name: 1 });
    const vehicles = await Car.find().sort({ name: 1, year: -1 });

    // Count each status
    const today = new Date();

    const activeRentals = rentals.filter((rental) => {
      return (
        rental.status === "Confirmed" &&
        new Date(rental.startDate) <= today &&
        new Date(rental.endDate) >= today
      );
    }).length;

    const confirmedRentals = rentals.filter(
      (r) => r.status === "Confirmed" && new Date(r.startDate) > today
    ).length;

    const completedRentals = rentals.filter(
      (r) => r.status === "Completed"
    ).length;

    const overdueRentals = rentals.filter((r) => {
      return r.status === "Active" && new Date(r.endDate) < today;
    }).length;

    res.render("rentals", {
      title: "Rental Management",
      activePage: "rentals",
      rentals: validRentals,
      customers,
      vehicles,
      activeRentals,
      confirmedRentals,
      completedRentals,
      overdueRentals,
    });
  } catch (err) {
    res.status(500).send("Error Loading rentals: " + err.message);
  }
});

// Get a single rental data by id
router.get("/rentals/:id", async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("vehicle")
      .populate("customer");

    if (!rental) return res.status(404).json({ message: "Rental not found" });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/rentals", async (req, res) => {
  try {
    const { customerId, vehicleId, startDate, endDate, dailyRate } = req.body;

    if (!customerId || !vehicleId || !startDate || !endDate || !dailyRate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalAmount = durationDays * parseFloat(dailyRate);

    const rental = new Rental({
      customer: customerId,
      vehicle: vehicleId,
      bookingId: uuidv4(),
      dailyRate,
      startDate,
      endDate,
      status: "Confirmed",
      totalAmount,
      createdAt: new Date(),
    });

    await rental.save();

    //
    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalRentals: 1,
        totalSpent: totalAmount,
      },
    });

    res.status(201).json({ message: "Rental created", rental });
  } catch (err) {
    console.error("Error creating rental:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
