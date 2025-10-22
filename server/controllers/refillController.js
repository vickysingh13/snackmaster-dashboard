import Refill from "../models/refillLog.js"; // matches your file
import Product from "../models/Product.js";
import VendingMachine from "../models/vendingMachine.js"; // optional if needed

// Get all refill logs
export const getRefills = async (req, res) => {
  try {
    const refills = await Refill.find().populate("machine").populate("items.product");
    res.status(200).json(refills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Log a new refill operation
export const createRefill = async (req, res) => {
  try {
    const { machine, refilledBy, items } = req.body;
    const refill = await Refill.create({ machine, refilledBy, items });

    // Update quantities in vending machine
    const vendingMachine = await VendingMachine.findById(machine);
    if (vendingMachine) {
      items.forEach(item => {
        const existing = vendingMachine.products.find(p => p.product.toString() === item.product);
        if (existing) {
          existing.quantity += item.quantityAdded;
        } else {
          vendingMachine.products.push({
            product: item.product,
            quantity: item.quantityAdded
          });
        }
      });
      await vendingMachine.save();
    }

    res.status(201).json({ message: "Refill logged successfully", refill });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
