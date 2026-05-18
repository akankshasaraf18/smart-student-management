const express = require("express");
const { body, param } = require("express-validator");
const {
  listCourses,
  listStudents,
  getStudent,
  createStudent,
  editStudent,
  removeStudent,
} = require("../controllers/studentController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

const studentValidation = [
  body("student_code").trim().notEmpty().withMessage("Student ID is required"),
  body("full_name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("course_id").isInt({ min: 1 }).withMessage("Course is required"),
  body("phone_number")
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage("Valid phone number is required"),
  body("address").trim().isLength({ min: 5 }).withMessage("Address is required"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("Gender is required"),
  body("date_of_birth").isDate().withMessage("Date of birth is required"),
];

router.use(authenticateToken);

router.get("/courses", listCourses);
router.get("/", listStudents);
router.get("/:id", [param("id").isInt({ min: 1 })], getStudent);
router.post("/", studentValidation, createStudent);
router.put("/:id", [param("id").isInt({ min: 1 }), ...studentValidation], editStudent);
router.delete("/:id", [param("id").isInt({ min: 1 })], removeStudent);

module.exports = router;
