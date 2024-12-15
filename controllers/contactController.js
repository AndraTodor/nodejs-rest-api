const Contact = require("../models/contact");

const getContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query;

    const filter = { owner: req.user._id }; // Doar contactele utilizatorului curent
    if (favorite !== undefined) {
      filter.favorite = favorite === "true";
    }

    const skip = (page - 1) * limit;
    const contacts = await Contact.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const listContacts = async () => {
  return await Contact.find();
};

const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId);
};

const addContact = async (body) => {
  return await Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

const updateStatusContact = async (contactId, body) => {
  return await Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  getContacts,
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
