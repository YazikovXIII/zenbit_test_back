const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
