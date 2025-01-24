const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const gravatar = require("gravatar");

const avatarsDir = path.join(__dirname, "../public/avatars");

require("dotenv").config();

const { SECRET_KEY } = process.env;

// Funcție de înregistrare si generare avatar
const register = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
  const newUser = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
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
  try {
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
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Creează token-ul

    await User.findByIdAndUpdate(user._id, { token }); // Salvează token-ul în baza de date

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};

// Funcție de delogare - in Postam trebuie trecut tokenul atat in body cat si la authorization header - Bearer token
const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null }); // Setează token-ul pe null pentru a "deloga" utilizatorul
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

// Funcție pentru utilizatorul curent
const getCurrentUser = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.status(200).json({
    message: "Current user information",
    email,
    subscription,
    avatarURL,
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

// Funcție pentru actualizarea avatarului
const updateAvatar = async (req, res) => {
  try {
    const { path: tempUpload, originalname } = req.file;
    console.log("Temp Upload Path:", tempUpload);
    console.log("Original Filename:", originalname);

    const { _id: id } = req.user;
    const filename = `${id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    console.log("Result Upload Path:", resultUpload);

    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);

    // Redimensionează imaginea folosind Jimp
    const image = await Jimp.read(resultUpload);
    await image.resize(250, 250).writeAsync(resultUpload);

    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    console.error("Error in updateAvatar:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
