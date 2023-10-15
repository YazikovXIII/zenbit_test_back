const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts");
const path = require("path");

dotenv.config();

const app = express();

const publicPath = path.join(__dirname, "public");
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactsRouter);
app.use("/users", authRouter);

app.use(express.static(publicPath));
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "server error" } = err;
  res.status(status).json({ message: message });
});

module.exports = app;
