const pool = require("../models/db");

async function getOverview(req, res, next) {
  try {
    const [[studentCount]] = await pool.query(`SELECT COUNT(*) AS totalStudents FROM students`);
    const [[courseCount]] = await pool.query(`SELECT COUNT(*) AS totalCourses FROM courses`);

    const [[attendanceStats]] = await pool.query(`
      SELECT
        ROUND((SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100, 2) AS attendancePercentage
      FROM attendance
    `);

    const [recentActivities] = await pool.query(
      `SELECT activity_id, activity_type, description, created_at
       FROM activities
       ORDER BY created_at DESC
       LIMIT 8`
    );

    const [monthlyAdmissions] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS total
      FROM students
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `);

    const [courseDistribution] = await pool.query(`
      SELECT c.course_name AS course, COUNT(s.student_id) AS total
      FROM courses c
      LEFT JOIN students s ON s.course_id = c.course_id
      GROUP BY c.course_id, c.course_name
      ORDER BY total DESC
    `);

    res.json({
      cards: {
        totalStudents: studentCount.totalStudents,
        totalCourses: courseCount.totalCourses,
        attendancePercentage: Number(attendanceStats.attendancePercentage || 0),
      },
      recentActivities,
      charts: {
        monthlyAdmissions,
        courseDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getOverview };
