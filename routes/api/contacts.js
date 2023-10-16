const express = require("express");
const { listContacts } = require("../../controllers/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts(req);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
