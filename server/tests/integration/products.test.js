import request from "supertest";
import app from "../../index.js";
import Product from "../../models/Product.js";
import VendingMachine from "../../models/VendingMachine.js";
import mongoose from "mongoose";
import { connectDB } from "../../config/db.js";

jest.setTimeout(30000);

describe("Products integration", () => {
  beforeAll(async () => {
    // If globalSetup didn't run or connection isn't ready, connect here.
    if (mongoose.connection.readyState !== 1) {
      // try to connect and wait for 'open'
      await connectDB();
      if (mongoose.connection.readyState !== 1) {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("Timed out waiting for mongoose connection")), 15000);
          mongoose.connection.once("open", () => {
            clearTimeout(timer);
            resolve();
          });
        });
      }
    }
  });

  afterAll(async () => {
    // clean up DB and connection
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
      }
    } catch (e) {
      // ignore cleanup errors
    }
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

    // Accept either an array response or an object with a products array (handles both styles)
    const list = Array.isArray(res.body) ? res.body : (res.body && Array.isArray(res.body.products) ? res.body.products : []);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);

    const found = list.find((p) => (p._id === prod._id.toString()) || (p.id === prod._id.toString()) || (p._id?.toString?.() === prod._id.toString()));
    expect(found).toBeTruthy();
  });
});