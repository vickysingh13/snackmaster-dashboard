import mongoose from "mongoose";
import RefillLog from "../models/RefillLog.js";
import Product from "../models/Product.js";
import VendingMachine from "../models/VendingMachine.js";

/**
 * POST /api/refills
 * body: { productId, machineId, quantityAdded, refilledBy, remarks }
 * Uses a MongoDB transaction to ensure atomicity.
 */
export const createRefill = async (req, res, next) => {
  const { productId, machineId, quantityAdded, refilledBy, remarks } = req.body;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const refill = await RefillLog.create(
      [
        {
          productId,
          machineId,
          quantityAdded,
          refilledBy,
          remarks,
        },
      ],
      { session }
    );

    if (refilledBy === "force-fail") {
      throw new Error("Simulated failure after creating refill (testing rollback)");
    }

    await Product.findByIdAndUpdate(
      productId,
      { $inc: { quantity: quantityAdded } },
      { session }
    );

    await VendingMachine.updateOne(
      { _id: machineId, "stock.product": productId },
      { $inc: { "stock.$.quantity": quantityAdded } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(refill[0]);
  } catch (err) {
    try {
      await session.abortTransaction();
    } catch (abortErr) {
      // ignore
    } finally {
      session.endSession();
    }

    // Safely handle when next is not provided (tests sometimes call controller directly)
    if (typeof next === "function") {
      return next(err);
    }

    // Fallback response when called without Express next()
    // eslint-disable-next-line no-console
    console.error("Unhandled controller error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export default { createRefill };
