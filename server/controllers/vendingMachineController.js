import VendingMachine from "../models/VendingMachine.js";

// Get all vending machines
export const getMachines = async (req, res) => {
  try {
    const machines = await VendingMachine.find().populate("products.product");
    res.status(200).json(machines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single machine by ID
export const getMachineById = async (req, res) => {
  try {
    const machine = await VendingMachine.findById(req.params.id).populate("products.product");
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    res.status(200).json(machine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new machine
export const createMachine = async (req, res) => {
  try {
    const machine = await VendingMachine.create(req.body);
    res.status(201).json(machine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update machine
export const updateMachine = async (req, res) => {
  try {
    const updated = await VendingMachine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete machine
export const deleteMachine = async (req, res) => {
  try {
    await VendingMachine.findByIdAndDelete(req.params.id);
    res.json({ message: "Vending machine deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
