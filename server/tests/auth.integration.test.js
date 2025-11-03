import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // adjust path if your express app is exported elsewhere

let mongod;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: "test" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  // clear all collections
  await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
});

test("register + login returns token for thetester@example.com", async () => {
  const registerPayload = {
    name: "The Tester",
    email: "thetester@example.com",
    password: "Password123!"
  };

  // register
  const regRes = await request(app)
    .post("/api/auth/register")
    .send(registerPayload)
    .expect(201);

  expect(regRes.body).toBeDefined();
  // login
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: registerPayload.email, password: registerPayload.password })
    .expect(200);

  expect(loginRes.body).toBeDefined();
  expect(typeof loginRes.body.token).toBe("string");
  expect(loginRes.body.token.length).toBeGreaterThan(10);
});

test("login fails with incorrect password", async () => {
  const registerPayload = {
    name: "The Tester",
    email: "thetester@example.com",
    password: "Password123!"
  };

  await request(app).post("/api/auth/register").send(registerPayload).expect(201);

  await request(app)
    .post("/api/auth/login")
    .send({ email: registerPayload.email, password: "WrongPassword" })
    .expect(401);
});