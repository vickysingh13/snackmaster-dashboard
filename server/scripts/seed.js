import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Product from "../models/Product.js";
import VendingMachine from "../models/VendingMachine.js";
import RefillLog from "../models/RefillLog.js";
import { info, error as logError } from "../utils/logger.js";

if (process.env.NODE_ENV === "production") {
  logError("Refusing to run seed script in production");
  process.exit(1);
}

// ---------- Safety: refuse to seed a production Atlas DB ----------
const MONGO_URI = process.env.MONGO_URI || "";
const isAtlas = /(\.mongodb\.net|^mongodb\+srv:)/i.test(MONGO_URI);

// If the URI points to Atlas and we're in production -> always refuse
if (isAtlas && process.env.NODE_ENV === "production") {
  logError("Refusing to run seed: MONGO_URI points to Atlas and NODE_ENV=production.");
  process.exit(1);
}

// If the URI points to Atlas in non-production, require an explicit override to avoid accidental runs.
// Set ALLOW_SEED=true in the environment to bypass this protection (dangerous).
if (isAtlas && process.env.ALLOW_SEED !== "true") {
  logError(
    "Refusing to run seed: MONGO_URI appears to point to MongoDB Atlas.\n" +
      "To run the seed against Atlas explicitly set ALLOW_SEED=true in your environment (use with caution)."
  );
  process.exit(1);
}
// ---------- end safety check ----------

async function seed() {
  try {
    if (!process.env.MONGO_URI && !process.env.NODE_ENV) {
      // allow connectDB to use local fallback, but warn user
      info("MONGO_URI not set — using local fallback (dev only).");
    }

    await connectDB();

    // WARNING: destructive for dev only
    await Promise.all([
      Product.deleteMany({}),
      VendingMachine.deleteMany({}),
      RefillLog.deleteMany({}),
    ]);

    const machine = await VendingMachine.create({
      machineCode: "VM-001",
      location: "Dev - Dock",
      totalSlots: 100,
      stock: [],
    });

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