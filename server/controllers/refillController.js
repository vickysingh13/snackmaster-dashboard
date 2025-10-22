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
    const { machine, refilledBy, items } = req.body;
    if (!machine || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "machine and items[] are required" });
    }

    const createdLogs = [];
    const vendingMachine = await VendingMachine.findById(machine);
    if (!vendingMachine) return res.status(404).json({ message: "Vending machine not found" });

    for (const item of items) {
      const productId = item.product || item.productId;
      const qty = Number(item.quantityAdded ?? item.quantity ?? 0);
      if (!productId || qty <= 0) continue;

      const log = await RefillLog.create({
        productId,
        machineId: machine,
        quantityAdded: qty,
        refilledBy: refilledBy || null,
        remarks: item.remarks || ""
      });
      createdLogs.push(log);

      const existing = vendingMachine.stock.find(s => s.productId?.toString() === productId.toString());
      if (existing) {
        existing.quantity = (existing.quantity || 0) + qty;
      } else {
        vendingMachine.stock.push({ productId, quantity: qty });
      }
    }

    await vendingMachine.save();

    res.status(201).json({ message: "Refill logged successfully", createdLogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
