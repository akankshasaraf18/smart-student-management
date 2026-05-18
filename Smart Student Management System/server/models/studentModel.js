const pool = require("./db");

const SORT_COLUMN_MAP = {
  id: "s.student_id",
  name: "s.full_name",
  email: "s.email",
  course: "c.course_name",
  dob: "s.date_of_birth",
};

async function getAllCourses() {
  const [rows] = await pool.query(`SELECT course_id, course_name FROM courses ORDER BY course_name ASC`);
  return rows;
}

async function getStudents({ page, limit, search, courseId, gender, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;
  const whereClauses = [];
  const values = [];

  if (search) {
    whereClauses.push(`(
      s.student_code LIKE ? OR
      s.full_name LIKE ? OR
      s.email LIKE ? OR
      s.phone_number LIKE ?
    )`);
    values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (courseId) {
    whereClauses.push("s.course_id = ?");
    values.push(courseId);
  }

  if (gender) {
    whereClauses.push("s.gender = ?");
    values.push(gender);
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const sortColumn = SORT_COLUMN_MAP[sortBy] || "s.student_id";
  const normalizedOrder = sortOrder && sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const [rows] = await pool.query(
    `SELECT
      s.student_id,
      s.student_code,
      s.full_name,
      s.email,
      c.course_name,
      s.course_id,
      s.phone_number,
      s.address,
      s.gender,
      s.date_of_birth
    FROM students s
    LEFT JOIN courses c ON c.course_id = s.course_id
    ${whereSQL}
    ORDER BY ${sortColumn} ${normalizedOrder}
    LIMIT ? OFFSET ?`,
    [...values, Number(limit), Number(offset)]
  );

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM students s
     LEFT JOIN courses c ON c.course_id = s.course_id
     ${whereSQL}`,
    values
  );

  return { rows, total: countRows[0].total };
}

async function getStudentById(id) {
  const [rows] = await pool.query(
    `SELECT
      student_id,
      student_code,
      full_name,
      email,
      course_id,
      phone_number,
      address,
      gender,
      date_of_birth
     FROM students
     WHERE student_id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function addStudent(student) {
  const [result] = await pool.query(
    `INSERT INTO students (
      student_code,
      full_name,
      email,
      course_id,
      phone_number,
      address,
      gender,
      date_of_birth
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      student.student_code,
      student.full_name,
      student.email,
      student.course_id,
      student.phone_number,
      student.address,
      student.gender,
      student.date_of_birth,
    ]
  );

  await logActivity("STUDENT_CREATE", `Student created: ${student.full_name}`);
  return result.insertId;
}

async function updateStudent(id, student) {
  const [result] = await pool.query(
    `UPDATE students
     SET
      student_code = ?,
      full_name = ?,
      email = ?,
      course_id = ?,
      phone_number = ?,
      address = ?,
      gender = ?,
      date_of_birth = ?
     WHERE student_id = ?`,
    [
      student.student_code,
      student.full_name,
      student.email,
      student.course_id,
      student.phone_number,
      student.address,
      student.gender,
      student.date_of_birth,
      id,
    ]
  );

  if (result.affectedRows > 0) {
    await logActivity("STUDENT_UPDATE", `Student updated: ${student.full_name}`);
  }

  return result.affectedRows;
}

async function deleteStudent(id) {
  const student = await getStudentById(id);
  const [result] = await pool.query(`DELETE FROM students WHERE student_id = ?`, [id]);

  if (result.affectedRows > 0) {
    await logActivity("STUDENT_DELETE", `Student deleted: ${student ? student.full_name : id}`);
  }

  return result.affectedRows;
}

async function logActivity(type, description) {
  await pool.query(`INSERT INTO activities (activity_type, description) VALUES (?, ?)`, [type, description]);
}

module.exports = {
  getAllCourses,
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
};
