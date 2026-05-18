const express = require("express");
const { body } = require("express-validator");
const { login } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  login
);

module.exports = router;
