const express = require("express");
const { getOverview } = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/overview", authenticateToken, getOverview);

module.exports = router;
