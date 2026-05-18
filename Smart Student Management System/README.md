# Smart Student Management System

A modern full-stack Student Management System using:

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MySQL
- Auth: JWT + bcrypt password hashing
- Charts: Chart.js

## Folder Structure

```text
Smart Student Management System/
├── client/
│   ├── index.html
│   └── public/
│       ├── css/
│       │   └── styles.css
│       └── js/
│           └── app.js
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── db.js
│   │   ├── studentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── studentRoutes.js
│   ├── scripts/
│   │   └── seedAdmin.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── schema.sql
```

## Features

- Professional dashboard UI with gradient/glass cards
- Sidebar sections: Dashboard, Students, Courses, Attendance, Settings
- Dashboard cards + chart analytics + recent activities
- Students module with full CRUD
- Search, filter, sorting, pagination in student table
- Export students to CSV and PDF
- Toast notifications for success/error
- Loading overlay animations
- Dark mode toggle
- Responsive mobile and desktop design
- JWT auth for admin login
- bcrypt password hashing
- REST API architecture
- Centralized error handling

## Step-by-Step Setup

### 1) Clone/Open Project and Install Dependencies

```bash
npm install
```

### 2) Setup Environment Variables

Create `.env` from `.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smart_student_management
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=8h
```

### 3) MySQL Setup

Run the SQL schema file:

```sql
SOURCE path/to/Smart Student Management System/schema.sql;
```

If `SOURCE` path is difficult on your machine, open `schema.sql` in MySQL Workbench and run it directly.

### 4) Seed Admin User (bcrypt hash generated automatically)

```bash
npm run seed:admin
```

Default seeded admin credentials:

- Email: `admin@smartsms.com`
- Password: `Admin@123`

### 5) Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Open browser:

- `http://localhost:5000`

## API Endpoints (REST)

### Auth

- `POST /api/auth/login`

### Dashboard

- `GET /api/dashboard/overview` (JWT required)

### Students

- `GET /api/students/courses` (JWT required)
- `GET /api/students` (JWT required)
- `GET /api/students/:id` (JWT required)
- `POST /api/students` (JWT required)
- `PUT /api/students/:id` (JWT required)
- `DELETE /api/students/:id` (JWT required)

## Notes for Beginners

- Keep your MySQL server running before starting Node server.
- Run `npm run seed:admin` only once (or after changing DB).
- If token expires, login again.
- For custom admin credentials, set these env vars before seeding:
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
  - `ADMIN_NAME`
