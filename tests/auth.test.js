const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models/userModel"); // Importă corect modelul User
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  const password = await bcrypt.hash("password123", 10);
  await User.create({
    email: "test@example.com",
    password,
    avatarURL: "http://example.com/avatar.jpg",
  });
});

afterAll(async () => {
  await User.deleteMany({}); // Curăță baza de date după teste
  await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
  it("should return a token and user object", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toEqual(
      expect.objectContaining({
        email: "test@example.com",
      })
    );
  });
});
