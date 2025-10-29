import request from "supertest";
import app from "../../index.js";
import Product from "../../models/Product.js";
import VendingMachine from "../../models/VendingMachine.js";
import mongoose from "mongoose";

describe("Products integration", () => {
  beforeAll(async () => {
    // setup.js should have connected mongodb-memory-server and connectDB
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  test("GET /api/products returns created product", async () => {
    const machine = await VendingMachine.create({
      machineCode: "INT-VM-1",
      location: "int-test",
      totalSlots: 10,
      stock: []
    });

    const prod = await Product.create({
      name: "Integration Snack",
      price: 1.23,
      quantity: 10,
      capacity: 50,
      category: "snack",
      machineId: machine._id
    });

    const res = await request(app).get("/api/products").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((p) => p._id === prod._id.toString() || p.id === prod._id.toString());
    expect(found).toBeTruthy();
  });
});