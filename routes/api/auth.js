const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const {
  addUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
} = require("../../controllers/users");
const {
  regSchema,
  loginSchema,
  subscriptionSchema,
} = require("../../schemas/user");
const upload = require("../../middleware/upload");

router.post("/register", async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const { error } = regSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newUser = await addUser(req.body);
    const result = {
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    };
    res.status(201).json(result);
  } catch (error) {
    if (error.status === 409) {
      res.status(409).json({ message: error.message });
    } else {
      next(error);
    }
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await loginUser(email, password);

    const result = {
      token: user.token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: "Email or password is wrong" });
    } else {
      next(error);
    }
  }
});

router.post("/logout", authenticate, async (req, res, next) => {
  try {
    await logoutUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/current", authenticate, async (req, res, next) => {
  try {
    const currentUser = await getCurrentUser(req.user.id);
    res.status(200).json(currentUser);
  } catch (error) {
    next(error);
  }
});

router.patch("/", authenticate, async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { error } = subscriptionSchema.validate(body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { subscription } = body;
    const userId = req.user.id;

    const updatedUser = await updateSubscription(userId, subscription);

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  async (req, res, next) => {
    try {
      const updatedUser = await updateAvatar(req);

      res.status(200).json({
        avatarURL: updatedUser.avatarURL,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
