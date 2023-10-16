const Contact = require("../models/contact");

const listContacts = async (req) => {
  const contacts = await Contact.find();
  return contacts;
};

module.exports = {
  listContacts,
};
