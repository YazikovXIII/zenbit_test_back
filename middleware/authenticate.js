const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");
const CustomError = require("../helpers/customError");
dotenv.config();
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(CustomError("Not Authorized", 401));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user) {
      next(CustomError("Not Authorized", 401));
    }
    req.user = user;
    next();
  } catch {
    next(CustomError("Not Authorized", 401));
  }
};

module.exports = authenticate;
