const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const addUser = async (body) => {
  const existingUser = await User.findOne({ email: body.email });

  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);

  return User.create({ ...body, password: hashedPassword });
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.status = 401;
    throw error;
  }
  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1d",
  });

  user.token = token;

  await user.save();
  return user;
};

const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.token = null;

  await user.save();
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    email: user.email,
    subscription: user.subscription,
  };
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
