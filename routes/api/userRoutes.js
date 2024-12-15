const express = require("express");
const { updateSubscription } = require("../controllers/userController");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { getCurrentUser } = require("../../controllers/userController");

const router = express.Router();

router.patch("/", authMiddleware, updateSubscription);
router.get("/current", authMiddleware, getCurrentUser);

module.exports = router;
