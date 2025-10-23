// Correct imports (match actual filenames)
import RefillLog from "../models/RefillLog.js";
import Product from "../models/Product.js";
import VendingMachine from "../models/VendingMachine.js";

// Get all refill logs
export const getRefills = async (req, res) => {
  try {
    const refills = await RefillLog.find().populate("machineId").populate("productId");
    res.status(200).json(refills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new refill(s) — accepts body: { machine, refilledBy, items: [{ product, quantityAdded, remarks? }] }
export const createRefill = async (req, res) => {
  try {
    const { machine: machineId, items } = req.body;

    // prefer authenticated user name/id, fallback to body.refilledBy
    const user = req.user;
    const refilledByFromBody = req.body.refilledBy;
    const refilledBy = user ? (user.name || user._id?.toString()) : refilledByFromBody;

    // find machine
    const machine = await VendingMachine.findById(machineId);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const createdLogs = [];
    for (const it of items) {
      const productId = it.product;
      const quantityAdded = Number(it.quantityAdded || 0);
      if (!productId || quantityAdded <= 0) continue;

      const log = await RefillLog.create({
        productId,
        machineId: machine._id,
        quantityAdded,
        refilledBy,
        remarks: it.remarks || ""
      });

      // update machine stock (use helper)
      await machine.updateStock(productId, quantityAdded);

      createdLogs.push(log);
    }

    machine.lastRefilled = new Date();
    await machine.save();

    res.status(201).json({ logs: createdLogs });
  } catch (error) {
    console.error("createRefill error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
