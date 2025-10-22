import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import VendingMachine from "../models/VendingMachine.js";
import Product from "../models/Product.js";
import { getMachines, getMachineById, createMachine } from "../controllers/vendingMachineController.js";

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map(c => c.deleteMany({})));
});

test("getMachines returns list of machines with populated stock", async () => {
  const p = await Product.create({ name: "Chips", price: 1.0 });
  const vm = await VendingMachine.create({ name: "VM3", location: "Hall", stock: [{ productId: p._id, quantity: 2 }] });

  const req = {};
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await getMachines(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  const payload = res.json.mock.calls[0][0];
  expect(Array.isArray(payload)).toBe(true);
  expect(payload.length).toBe(1);
  expect(payload[0].stock[0].productId.name).toBe("Chips");
});

test("getMachineById returns 404 for missing machine", async () => {
  const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  await getMachineById(req, res);
  expect(res.status).toHaveBeenCalledWith(404);
});