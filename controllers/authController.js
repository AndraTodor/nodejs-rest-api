const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { SECRET_KEY } = process.env;

// Funcție de înregistrare
const register = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

// Funcție de logare
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); //Creeaza token-ul

  await User.findByIdAndUpdate(user._id, { token }); //Salveaaza token-ul in baza de date

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

// Funcție de delogare
const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null }); // Setează token-ul pe null pentru a "deloga" utilizatorul
    res.status(204).send(); // Răspuns pentru succes
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

// Funcție pentru utilizatorul curent
const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

// Funcție de actualizare a abonamentului
const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  if (!["starter", "pro", "business"].includes(subscription)) {
    return res.status(400).json({ message: "Invalid subscription type" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  res.status(200).json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
};
