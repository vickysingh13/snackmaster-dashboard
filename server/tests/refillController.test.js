import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import RefillLog from "../models/RefillLog.js";
import Product from "../models/Product.js";
import VendingMachine from "../models/VendingMachine.js";
import { createRefill, getRefills } from "../controllers/refillController.js";

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

test("createRefill creates RefillLog entries and updates VendingMachine stock", async () => {
  const machine = await VendingMachine.create({
    name: "VM1",
    location: "Office",
    machineCode: "VM1-CODE",
    totalSlots: 20,
    stock: []
  });
  const product = await Product.create({
    name: "Soda",
    price: 1.5,
    machineId: machine._id,
    quantity: 20,
    category: "drink"
  });

  const req = {
    body: {
      machine: machine._id.toString(),
      refilledBy: "tech1",
      items: [{ product: product._id.toString(), quantityAdded: 5 }]
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await createRefill(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalled();

  const logs = await RefillLog.find();
  expect(logs.length).toBe(1);
  expect(logs[0].quantityAdded).toBe(5);

  const vm = await VendingMachine.findById(machine._id);
  const stockEntry = vm.stock.find(s => s.productId.toString() === product._id.toString());
  expect(stockEntry).toBeDefined();
  expect(stockEntry.quantity).toBe(5);
});

test("getRefills returns refill logs", async () => {
  const machine = await VendingMachine.create({
    name: "VM2",
    location: "Lobby",
    machineCode: "VM2-CODE",
    totalSlots: 16,
    stock: []
  });
  const product = await Product.create({
    name: "Bar",
    price: 2.0,
    machineId: machine._id,
    quantity: 5,
    category: "snack"
  });
  // include required `refilledBy`
  await RefillLog.create({
    productId: product._id,
    machineId: machine._id,
    quantityAdded: 3,
    refilledBy: "system"
  });

  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await getRefills(req, res);
  expect(res.status).toHaveBeenCalledWith(200);
  const payload = res.json.mock.calls[0][0];
  expect(Array.isArray(payload)).toBe(true);
  expect(payload.length).toBe(1);
});