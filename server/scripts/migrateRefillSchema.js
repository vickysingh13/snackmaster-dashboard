import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import RefillLog from "../models/RefillLog.js";
import VendingMachine from "../models/VendingMachine.js";

const run = async () => {
  try {
    await connectDB(); // expects process.env.MONGO_URI
    const conn = mongoose.connection;

    const colNames = (await conn.db.listCollections().toArray()).map(c => c.name);
    if (!colNames.includes("refills")) {
      console.log("No legacy 'refills' collection found. Nothing to migrate.");
      process.exit(0);
    }

    const legacyDocs = await conn.collection("refills").find().toArray();
    console.log(`Found ${legacyDocs.length} legacy refill docs.`);

    for (const doc of legacyDocs) {
      const machineId = doc.machine || doc.machineId;
      const items = Array.isArray(doc.items) ? doc.items : [];

      if (!machineId || items.length === 0) {
        console.log(`Skipping legacy doc _id=${doc._id} (missing machine or items)`);
        continue;
      }

      const vm = await VendingMachine.findById(machineId);
      if (!vm) {
        console.log(`Machine ${machineId} not found for legacy doc ${doc._id}, skipping`);
        continue;
      }

      for (const item of items) {
        const productId = item.product || item.productId;
        const qty = Number(item.quantityAdded ?? item.quantity ?? 0);
        if (!productId || qty <= 0) continue;

        await RefillLog.create({
          productId,
          machineId,
          quantityAdded: qty,
          refilledBy: doc.refilledBy || null,
          remarks: item.remarks || doc.remarks || "",
          createdAt: doc.createdAt || undefined,
        });

        const existing = vm.stock.find(s => s.productId?.toString() === productId.toString());
        if (existing) {
          existing.quantity = (existing.quantity || 0) + qty;
        } else {
          vm.stock.push({ productId, quantity: qty });
        }
      }

      await vm.save();
      await conn.collection("refills_migrated").insertOne({ ...doc, migratedAt: new Date() });
      await conn.collection("refills").deleteOne({ _id: doc._id });
      console.log(`Migrated legacy doc ${doc._id}`);
    }

    console.log("Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

run();