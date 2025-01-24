const express = require("express");
const {
  updateSubscription,
  getCurrentUser,
  updateAvatar,
} = require("../../controllers/authController");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.patch("/", authMiddleware, updateSubscription);
router.get("/current", authMiddleware, getCurrentUser);
router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = router;
