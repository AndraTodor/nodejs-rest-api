const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
} = require("../../controllers/authController");
const {
  validateSignup,
  validateLogin,
} = require("../../middlewares/validationMiddleware");
const { authMiddleware } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", validateSignup, register);
router.post("/login", validateLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/current", authMiddleware, getCurrentUser);
router.patch("/subscription", authMiddleware, updateSubscription);

module.exports = router;
