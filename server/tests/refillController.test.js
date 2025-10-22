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
  const product = await Product.create({ name: "Soda", price: 1.5 });
  const machine = await VendingMachine.create({ name: "VM1", location: "Office", stock: [] });

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
  const product = await Product.create({ name: "Bar", price: 2.0 });
  const machine = await VendingMachine.create({ name: "VM2", location: "Lobby", stock: [] });
  await RefillLog.create({ productId: product._id, machineId: machine._id, quantityAdded: 3 });

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