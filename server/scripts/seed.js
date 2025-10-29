import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";
import VendingMachine from "../models/VendingMachine.js";
import RefillLog from "../models/RefillLog.js";
import { info, error as logError } from "../utils/logger.js";
import mongoose from "mongoose";

if (process.env.NODE_ENV === "production") {
  logError("Refusing to run seed script in production");
  process.exit(1);
}

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      logError("MONGO_URI not set. Add it to server/.env or environment and try again.");
      process.exit(2);
    }

    await connectDB();

    // WARNING: deletes collections — safe for dev only
    await Promise.all([
      Product.deleteMany({}),
      VendingMachine.deleteMany({}),
      RefillLog.deleteMany({}),
    ]);

    // 1) create machine first (set required totalSlots)
    const machine = await VendingMachine.create({
      machineCode: "VM-001",
      location: "Dev - Dock",
      totalSlots: 100, // ensure total stocked items fit the machine validation
      stock: [],       // will populate after products created
    });

    // 2) create products with required fields (machineId and category)
    const products = await Product.create([
      {
        name: "Choco Bar",
        price: 1.5,
        quantity: 50,
        capacity: 100,
        category: "snack",
        machineId: machine._id,
      },
      {
        name: "Soda Can",
        price: 1.0,
        quantity: 40,
        capacity: 80,
        category: "drink",
        machineId: machine._id,
      },
    ]);

    // 3) update machine stock to reference created products
    machine.stock = [
      {
        slot: 1,
        product: products[0]._id,
        productName: products[0].name,
        quantity: 10,
        capacity: products[0].capacity ?? 100,
      },
      {
        slot: 2,
        product: products[1]._id,
        productName: products[1].name,
        quantity: 8,
        capacity: products[1].capacity ?? 80,
      },
    ];
    await machine.save();

    // 4) create a refill log entry referencing product and machine
    const refill = await RefillLog.create({
      productId: products[0]._id,
      machineId: machine._id,
      quantityAdded: 20,
      refilledBy: "seed-script",
      remarks: "initial seed",
    });

    info("Seed complete");
    info("Products:", products.map((p) => ({ id: p._id.toString(), name: p.name })));
    info("Machine:", { id: machine._id.toString(), machineCode: machine.machineCode });
    info("RefillLog:", { id: refill._id.toString(), quantityAdded: refill.quantityAdded });

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    logError("Seed failed:", err);
    try { await disconnectDB(); } catch (e) { /* ignore */ }
    process.exit(1);
  }
}

seed();