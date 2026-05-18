const { validationResult } = require("express-validator");
const {
  getAllCourses,
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../models/studentModel");

function formatMysqlError(error) {
  if (error.code === "ER_DUP_ENTRY") {
    return "Duplicate entry. Email or Student ID already exists.";
  }
  return "Database operation failed.";
}

async function listCourses(req, res, next) {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
}

async function listStudents(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 8);

    const data = await getStudents({
      page,
      limit,
      search: req.query.search || "",
      courseId: req.query.courseId || "",
      gender: req.query.gender || "",
      sortBy: req.query.sortBy || "id",
      sortOrder: req.query.sortOrder || "DESC",
    });

    res.json({
      items: data.rows,
      pagination: {
        page,
        limit,
        total: data.total,
        totalPages: Math.ceil(data.total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getStudent(req, res, next) {
  try {
    const student = await getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    return next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const insertedId = await addStudent(req.body);
    return res.status(201).json({ message: "Student added successfully", id: insertedId });
  } catch (error) {
    if (error.code) {
      return res.status(400).json({ message: formatMysqlError(error) });
    }
    return next(error);
  }
}

async function editStudent(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const affected = await updateStudent(req.params.id, req.body);
    if (!affected) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student updated successfully" });
  } catch (error) {
    if (error.code) {
      return res.status(400).json({ message: formatMysqlError(error) });
    }
    return next(error);
  }
}

async function removeStudent(req, res, next) {
  try {
    const affected = await deleteStudent(req.params.id);
    if (!affected) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCourses,
  listStudents,
  getStudent,
  createStudent,
  editStudent,
  removeStudent,
};
