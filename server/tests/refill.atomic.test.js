import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../models/Product.js";
import VendingMachine from "../models/VendingMachine.js";
import RefillLog from "../models/RefillLog.js";
import { createRefill } from "../controllers/refillController.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Product.deleteMany({}),
    VendingMachine.deleteMany({}),
    RefillLog.deleteMany({}),
  ]);
});

function mockReq(body) {
  return { body };
}

function mockRes() {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.payload = payload;
    return res;
  };
  return res;
}

test("refill should be atomic: simulated failure rolls back all changes", async () => {
  // arrange
  // create machine first so Product can reference machineId (schema requires it)
  const machine = await VendingMachine.create({
    machineCode: "VM-TEST",
    location: "lab",
    totalSlots: 10,
    stock: [],
  });

  const prod = await Product.create({
    name: "FailTest",
    price: 1,
    quantity: 5,
    capacity: 100,
    category: "snack",
    machineId: machine._id,
  });

  // populate machine stock referencing the product
  machine.stock = [
    { slot: 1, product: prod._id, productName: prod.name, quantity: 2, capacity: 100 },
  ];
  await machine.save();

  const req = mockReq({
    productId: prod._id.toString(),
    machineId: machine._id.toString(),
    quantityAdded: 3,
    refilledBy: "force-fail",
    remarks: "test rollback",
  });
  const res = mockRes();
  let caughtError = null;
  const next = (err) => { caughtError = err; };

  // act
  await createRefill(req, res, next);

  // assert - error occurred
  expect(caughtError).toBeTruthy();

  // DB unchanged: no refill logs and product qty unchanged
  const logs = await RefillLog.find({});
  const freshProd = await Product.findById(prod._id);
  const freshMachine = await VendingMachine.findById(machine._id);

  expect(logs.length).toBe(0);
  expect(freshProd.quantity).toBe(5);
  // machine stock quantity unchanged
  expect(freshMachine.stock[0].quantity).toBe(2);
});

test("refill success updates product and machine and creates log", async () => {
  const machine = await VendingMachine.create({
    machineCode: "VM-OK",
    location: "lab",
    totalSlots: 10,
    stock: [],
  });

  const prod = await Product.create({
    name: "GoodTest",
    price: 1,
    quantity: 10,
    capacity: 100,
    category: "snack",
    machineId: machine._id,
  });

  machine.stock = [
    { slot: 1, product: prod._id, productName: prod.name, quantity: 2, capacity: 100 },
  ];
  await machine.save();

  const req = mockReq({
    productId: prod._id.toString(),
    machineId: machine._id.toString(),
    quantityAdded: 5,
    refilledBy: "tester",
    remarks: "normal refill",
  });
  const res = mockRes();
  const next = (err) => { if (err) throw err; };

  await createRefill(req, res, next);

  // verify
  const logs = await RefillLog.find({});
  const freshProd = await Product.findById(prod._id);
  const freshMachine = await VendingMachine.findById(machine._id);

  expect(logs.length).toBe(1);
  expect(freshProd.quantity).toBe(15); // 10 + 5
  expect(freshMachine.stock[0].quantity).toBe(7); // 2 + 5
});