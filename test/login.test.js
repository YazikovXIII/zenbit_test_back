const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
require("dotenv").config();
const { DB_HOST } = process.env;

const EMAIL = "jest@mail.com";
const PASSWORD = "jesttest";

beforeEach(async () => {
  await mongoose.connect(DB_HOST);
  await request(app).post("/users/register").send({
    email: EMAIL,
    password: PASSWORD,
  });
});

afterEach(async () => {
  await User.deleteMany({ email: EMAIL });
  await mongoose.connection.close();
});

describe("Login", () => {
  it("Should return (200),{token,user{email,subscription}}", async () => {
    const res = await request(app).post("/users/login").send({
      email: EMAIL,
      password: PASSWORD,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      token: expect.any(String),
      user: {
        email: EMAIL,
        subscription: "starter",
      },
    });
  });
});
