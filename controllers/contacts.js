const Contact = require("../models/contact");

const listContacts = async (req) => {
  const { page, limit, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner: req.user._id };

  if (favorite === "true") {
    query.favorite = true;
  }
  const contacts = await Contact.find(query)
    .skip(skip)
    .limit(limit)
    .populate("owner", "email subscription");
  return contacts;
};

const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove(contactId);
};

const addContact = async (req, res) => {
  const body = req.body;
  const { _id: owner } = req.user;
  return Contact.create({ ...body, owner });
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
