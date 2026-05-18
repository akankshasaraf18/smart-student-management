require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../models/db");

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@smartsms.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const adminName = process.env.ADMIN_NAME || "System Admin";

    const [existing] = await pool.query("SELECT user_id FROM users WHERE email = ? LIMIT 1", [adminEmail]);
    if (existing.length > 0) {
      console.log(`Admin already exists for email: ${adminEmail}`);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES (?, ?, ?, 'admin')`,
      [adminName, adminEmail, passwordHash]
    );

    console.log("Admin user created successfully.");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
}

seedAdmin();
