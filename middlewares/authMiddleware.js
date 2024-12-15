const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const { SECRET_KEY } = process.env;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", req.headers.authorization);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Decodifică token-ul
    console.log("Decoded Token:", decoded);
    const { id } = decoded;
    console.log("User Model:", User);
    const user = await User.findById(id); // Găsește utilizatorul după ID-ul decodificat
    console.log("User from DB:", user);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user; // Atașează utilizatorul la req pentru rutele următoare
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error.message);
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = { authMiddleware };
