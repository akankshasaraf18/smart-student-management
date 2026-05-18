const pool = require("./db");

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    `SELECT user_id, full_name, email, password_hash, role
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

module.exports = { findUserByEmail };
