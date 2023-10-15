const express = require("express");
const mongoose = require("mongoose");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const authenticate = require("../../middleware/authenticate");
const { schema, patchSchema } = require("../../schemas/contacts");
const router = express.Router();

router.get("/", authenticate, async (req, res, next) => {
  try {
    const contacts = await listContacts(req);
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", authenticate, async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Invalid contactId" });
    }

    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const newContact = await addContact(req, res);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", authenticate, async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Invalid contactId" });
    }

    const removedContact = await removeContact(contactId);

    if (!removedContact) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({ message: `Contact ${removedContact.name} deleted` });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", authenticate, async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Invalid contactId" });
    }

    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { error } = schema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedContact = await updateContact(contactId, body);

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", authenticate, async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Invalid contactId" });
    }

    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const { error } = patchSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const updatedStatusContact = await updateStatusContact(contactId, body);
    if (!updatedStatusContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedStatusContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
