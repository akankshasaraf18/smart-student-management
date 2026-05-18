# 🎓 Smart Student Management System

A modern full-stack Student Management System built using HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.

This project helps administrators manage student records efficiently with complete CRUD operations, authentication, dashboard analytics, responsive UI, and database integration.

---

# 🚀 Features

## 👨‍🎓 Student Management
- Add Students
- Update Student Details
- Delete Students
- Search Students
- View Student List

## 📊 Dashboard
- Total Students Count
- Total Courses
- Attendance Statistics
- Activity Overview
- Charts & Analytics

## 🔐 Authentication
- Admin Login
- JWT Authentication
- Password Hashing using bcrypt

## 🎨 UI Features
- Responsive Design
- Dark Mode
- Modern Dashboard UI
- Toast Notifications
- Loading Animations

## 📁 Database Features
- MySQL Database Integration
- CRUD Operations
- Structured Tables
- SQL Queries

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Libraries & Tools
- bcrypt
- JWT
- Chart.js
- dotenv
- cors

---

# 📂 Project Folder Structure

```bash
Smart Student Management System/
│
├── client/
│   │
│   ├── public/
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   ├── login.html
│   │   └── favicon.ico
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── dashboard.js
│   │   ├── auth.js
│   │   └── students.js
│   │
│   └── assets/
│       ├── images/
│       └── icons/
│
├── server/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── studentController.js
│   │   └── authController.js
│   │
│   ├── models/
│   │   └── studentModel.js
│   │
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   └── server.js
│
├── database/
│   └── studentdb.sql
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone https://github.com/akankshasaraf18/smart-student-management.git
```

---

## 2️⃣ Open Project

```bash
cd smart-student-management
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# 🗄️ MySQL Database Setup

## Create Database

```sql
CREATE DATABASE studentdb;
```

## Use Database

```sql
USE studentdb;
```

## Create Students Table

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    course VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    gender VARCHAR(20),
    dob DATE
);
```

---

# 🔑 Environment Variables

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=studentdb

JWT_SECRET=studentmanagementsecret
```

---

# ▶️ Run Project

## Start Backend Server

```bash
node server.js
```

OR

```bash
npm start
```

---

# 🌐 Open in Browser

```bash
http://localhost:5000
```

---

# 📸 Screenshots

## Dashboard
- Modern Admin Dashboard
- Student Statistics
- Charts & Graphs

## Student Management
- Add/Edit/Delete Students
- Search & Filter Records

## Authentication
- Secure Login System

---

# 📈 Future Enhancements

- Attendance Module
- Marks Management
- AI Chatbot Assistant
- PDF Report Generation
- Email Notifications
- Role-Based Access
- Cloud Deployment
- Docker Support

---

# 💡 Learning Outcomes

Through this project, I learned:

- Full-stack development
- REST API creation
- MySQL database integration
- Authentication using JWT
- CRUD operations
- Responsive UI design
- Backend architecture

---

# 👩‍💻 Author

## Akanksha Saraf

- GitHub: https://github.com/akankshasaraf18

---

# ⭐ Support

If you like this project:
- Star this repository
- Fork the repository
- Share with others

---

# 📜 License

This project is developed for educational and learning purposes.
