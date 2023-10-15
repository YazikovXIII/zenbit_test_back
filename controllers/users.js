const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

const addUser = async (body) => {
  const existingUser = await User.findOne({ email: body.email });

  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(body.password, 10);
  const avatar = gravatar.url(body.email, { s: "250", r: "pg", d: "nm" });

  return User.create({ ...body, password: hashedPassword, avatarURL: avatar });
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

const updateSubscription = async (userId, subscription) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );

  if (!updatedUser) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }

  return updatedUser;
};

const updateAvatar = async (req) => {
  const userId = req.user.id;
  const tempPath = req.file.path;
  const avatarPath = path.join(
    __dirname,
    "..",
    "public",
    "avatars",
    `${userId}.jpg`
  );

  const image = await Jimp.read(tempPath);
  await image.resize(250, 250).writeAsync(avatarPath);
  fs.unlink(tempPath, (err) => {
    if (err) {
      console.error("Deletion ERROR:", err);
    }
  });

  const avatarURL = `avatars/${userId}.jpg`;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatarURL },
    { new: true }
  );

  if (!updatedUser) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }

  return updatedUser;
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
