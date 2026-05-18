CREATE DATABASE IF NOT EXISTS smart_student_management;
USE smart_student_management;

-- =============================
-- Table: users
-- =============================
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- Table: courses
-- =============================
CREATE TABLE IF NOT EXISTS courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(120) NOT NULL UNIQUE,
  instructor_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- Table: students
-- =============================
CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  student_code VARCHAR(25) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  course_id INT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  address VARCHAR(255) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_courses FOREIGN KEY (course_id)
    REFERENCES courses(course_id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- =============================
-- Table: attendance
-- =============================
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present', 'Absent', 'Late') NOT NULL,
  CONSTRAINT fk_attendance_students FOREIGN KEY (student_id)
    REFERENCES students(student_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================
-- Table: activities
-- =============================
CREATE TABLE IF NOT EXISTS activities (
  activity_id INT AUTO_INCREMENT PRIMARY KEY,
  activity_type VARCHAR(40) NOT NULL,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================
-- Sample Course Data
-- =============================
INSERT INTO courses (course_name, instructor_name)
VALUES
('Computer Science', 'Dr. Martha Jones'),
('Business Administration', 'Prof. Liam Carter'),
('Mechanical Engineering', 'Dr. Noor Rahman'),
('Data Analytics', 'Prof. Elena Petrova')
ON DUPLICATE KEY UPDATE instructor_name = VALUES(instructor_name);

-- =============================
-- Sample Student Data
-- =============================
INSERT INTO students (student_code, full_name, email, course_id, phone_number, address, gender, date_of_birth)
VALUES
('STU1001', 'Aarav Sharma', 'aarav.sharma@example.com', 1, '+91 9898989891', 'Mumbai, India', 'Male', '2003-04-10'),
('STU1002', 'Emily Rivera', 'emily.rivera@example.com', 4, '+1 3125550189', 'Chicago, USA', 'Female', '2002-11-02'),
('STU1003', 'Noah Kim', 'noah.kim@example.com', 2, '+82 1022233344', 'Seoul, South Korea', 'Male', '2001-08-17'),
('STU1004', 'Fatima Khan', 'fatima.khan@example.com', 1, '+971 553344556', 'Dubai, UAE', 'Female', '2003-01-25')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- =============================
-- Sample Attendance Data
-- =============================
INSERT INTO attendance (student_id, attendance_date, status)
VALUES
(1, CURDATE() - INTERVAL 2 DAY, 'Present'),
(1, CURDATE() - INTERVAL 1 DAY, 'Present'),
(2, CURDATE() - INTERVAL 2 DAY, 'Absent'),
(2, CURDATE() - INTERVAL 1 DAY, 'Present'),
(3, CURDATE() - INTERVAL 2 DAY, 'Late'),
(3, CURDATE() - INTERVAL 1 DAY, 'Present'),
(4, CURDATE() - INTERVAL 2 DAY, 'Present'),
(4, CURDATE() - INTERVAL 1 DAY, 'Present')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- =============================
-- Sample Activity Data
-- =============================
INSERT INTO activities (activity_type, description)
VALUES
('SYSTEM_INIT', 'System initialized with sample records'),
('STUDENT_CREATE', 'Student created: Aarav Sharma'),
('STUDENT_CREATE', 'Student created: Emily Rivera')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ==========================================================
-- Required CRUD SQL Query Examples
-- ==========================================================

-- INSERT
-- INSERT INTO students (student_code, full_name, email, course_id, phone_number, address, gender, date_of_birth)
-- VALUES ('STU1100', 'John Doe', 'john@example.com', 1, '+1 9876543210', 'New York', 'Male', '2002-06-15');

-- SELECT
-- SELECT s.student_id, s.student_code, s.full_name, s.email, c.course_name
-- FROM students s
-- LEFT JOIN courses c ON c.course_id = s.course_id
-- ORDER BY s.student_id DESC;

-- UPDATE
-- UPDATE students
-- SET full_name = 'John M Doe', phone_number = '+1 1112223333'
-- WHERE student_id = 1;

-- DELETE
-- DELETE FROM students WHERE student_id = 1;
