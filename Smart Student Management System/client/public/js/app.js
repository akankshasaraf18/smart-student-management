const API_BASE = "/api";

const state = {
  token: localStorage.getItem("sms_token") || "",
  user: JSON.parse(localStorage.getItem("sms_user") || "null"),
  courses: [],
  students: [],
  pagination: { page: 1, limit: 8, totalPages: 1, total: 0 },
  filters: {
    search: "",
    courseId: "",
    gender: "",
    sortBy: "id",
    sortOrder: "DESC",
  },
  charts: {
    admission: null,
    course: null,
  },
};

const els = {
  loginView: document.getElementById("loginView"),
  appView: document.getElementById("appView"),
  loginForm: document.getElementById("loginForm"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  toastContainer: document.getElementById("toastContainer"),
  logoutBtn: document.getElementById("logoutBtn"),
  adminBadge: document.getElementById("adminBadge"),
  navItems: document.querySelectorAll(".nav-item"),
  sectionTitle: document.getElementById("sectionTitle"),
  totalStudentsCard: document.getElementById("totalStudentsCard"),
  totalCoursesCard: document.getElementById("totalCoursesCard"),
  attendanceCard: document.getElementById("attendanceCard"),
  recentActivitiesList: document.getElementById("recentActivitiesList"),
  coursesPreview: document.getElementById("coursesPreview"),
  studentsTableBody: document.getElementById("studentsTableBody"),
  paginationContainer: document.getElementById("paginationContainer"),
  searchInput: document.getElementById("searchInput"),
  courseFilter: document.getElementById("courseFilter"),
  genderFilter: document.getElementById("genderFilter"),
  addStudentBtn: document.getElementById("addStudentBtn"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  exportPdfBtn: document.getElementById("exportPdfBtn"),
  studentModal: document.getElementById("studentModal"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  studentModalTitle: document.getElementById("studentModalTitle"),
  studentForm: document.getElementById("studentForm"),
  studentDbId: document.getElementById("studentDbId"),
  studentCode: document.getElementById("studentCode"),
  fullName: document.getElementById("fullName"),
  email: document.getElementById("email"),
  course: document.getElementById("course"),
  phoneNumber: document.getElementById("phoneNumber"),
  address: document.getElementById("address"),
  gender: document.getElementById("gender"),
  dateOfBirth: document.getElementById("dateOfBirth"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
};

function setLoading(loading) {
  els.loadingOverlay.classList.toggle("hidden", !loading);
}

function showToast(type, message) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  els.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

function formatDate(dateString) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function renderSection(sectionId) {
  document.querySelectorAll(".panel-section").forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");
  els.navItems.forEach((btn) => btn.classList.toggle("active", btn.dataset.section === sectionId));
  els.sectionTitle.textContent = sectionId.replace("Section", "");
}

function buildCourseOptions() {
  const options = ['<option value="">All Courses</option>'];
  const formOptions = ['<option value="">Select course</option>'];

  state.courses.forEach((course) => {
    options.push(`<option value="${course.course_id}">${course.course_name}</option>`);
    formOptions.push(`<option value="${course.course_id}">${course.course_name}</option>`);
  });

  els.courseFilter.innerHTML = options.join("");
  els.course.innerHTML = formOptions.join("");

  // Render compact list for Courses section preview.
  els.coursesPreview.innerHTML = state.courses.map((c) => `<li>${c.course_name}</li>`).join("");
}

function renderStudentTable() {
  if (state.students.length === 0) {
    els.studentsTableBody.innerHTML = `<tr><td colspan="8">No students found.</td></tr>`;
    return;
  }

  els.studentsTableBody.innerHTML = state.students
    .map(
      (student) => `
      <tr>
        <td>${student.student_code}</td>
        <td>${student.full_name}</td>
        <td>${student.email}</td>
        <td>${student.course_name || "-"}</td>
        <td>${student.phone_number}</td>
        <td>${student.gender}</td>
        <td>${formatDate(student.date_of_birth)}</td>
        <td>
          <button class="btn btn-secondary" onclick="openEditModal(${student.student_id})">Edit</button>
          <button class="btn btn-secondary" onclick="deleteStudent(${student.student_id})">Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderPagination() {
  const { page, totalPages } = state.pagination;

  if (totalPages <= 1) {
    els.paginationContainer.innerHTML = "";
    return;
  }

  const buttons = [];
  for (let i = 1; i <= totalPages; i += 1) {
    buttons.push(`<button class="${i === page ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`);
  }

  els.paginationContainer.innerHTML = buttons.join("");
}

function renderDashboard(data) {
  els.totalStudentsCard.textContent = data.cards.totalStudents;
  els.totalCoursesCard.textContent = data.cards.totalCourses;
  els.attendanceCard.textContent = `${data.cards.attendancePercentage}%`;

  els.recentActivitiesList.innerHTML = data.recentActivities
    .map((item) => `<li><strong>${item.activity_type}</strong> - ${item.description}</li>`)
    .join("");

  const admissionLabels = data.charts.monthlyAdmissions.map((x) => x.month);
  const admissionData = data.charts.monthlyAdmissions.map((x) => x.total);

  if (state.charts.admission) state.charts.admission.destroy();
  state.charts.admission = new Chart(document.getElementById("admissionChart"), {
    type: "line",
    data: {
      labels: admissionLabels,
      datasets: [
        {
          label: "New Students",
          data: admissionData,
          borderColor: "#0a9396",
          backgroundColor: "rgba(10, 147, 150, 0.2)",
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  const courseLabels = data.charts.courseDistribution.map((x) => x.course);
  const courseData = data.charts.courseDistribution.map((x) => x.total);

  if (state.charts.course) state.charts.course.destroy();
  state.charts.course = new Chart(document.getElementById("courseChart"), {
    type: "doughnut",
    data: {
      labels: courseLabels,
      datasets: [
        {
          data: courseData,
          backgroundColor: ["#005f73", "#0a9396", "#94d2bd", "#ee9b00", "#ca6702"],
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}

function validateStudentForm(payload) {
  if (!payload.student_code.trim()) return "Student ID is required";
  if (payload.full_name.trim().length < 2) return "Name must be at least 2 characters";
  if (!/^\S+@\S+\.\S+$/.test(payload.email)) return "Valid email is required";
  if (!payload.course_id) return "Course is required";
  if (!/^[0-9+\-\s]{7,20}$/.test(payload.phone_number)) return "Valid phone number is required";
  if (payload.address.trim().length < 5) return "Address is required";
  if (!["Male", "Female", "Other"].includes(payload.gender)) return "Gender is required";
  if (!payload.date_of_birth) return "Date of birth is required";
  return "";
}

function getStudentPayload() {
  return {
    student_code: els.studentCode.value.trim(),
    full_name: els.fullName.value.trim(),
    email: els.email.value.trim(),
    course_id: Number(els.course.value),
    phone_number: els.phoneNumber.value.trim(),
    address: els.address.value.trim(),
    gender: els.gender.value,
    date_of_birth: els.dateOfBirth.value,
  };
}

async function fetchCourses() {
  state.courses = await apiRequest("/students/courses");
  buildCourseOptions();
}

async function fetchDashboard() {
  const data = await apiRequest("/dashboard/overview");
  renderDashboard(data);
}

async function fetchStudents() {
  const params = new URLSearchParams({
    page: state.pagination.page,
    limit: state.pagination.limit,
    search: state.filters.search,
    courseId: state.filters.courseId,
    gender: state.filters.gender,
    sortBy: state.filters.sortBy,
    sortOrder: state.filters.sortOrder,
  });

  const data = await apiRequest(`/students?${params.toString()}`);
  state.students = data.items;
  state.pagination = data.pagination;

  renderStudentTable();
  renderPagination();
}

function openStudentModal() {
  els.studentModal.classList.remove("hidden");
}

function closeStudentModal() {
  els.studentModal.classList.add("hidden");
  els.studentForm.reset();
  els.studentDbId.value = "";
}

function prepareAddModal() {
  els.studentModalTitle.textContent = "Add Student";
  openStudentModal();
}

async function openEditModal(studentId) {
  try {
    setLoading(true);
    const student = await apiRequest(`/students/${studentId}`);

    els.studentModalTitle.textContent = "Edit Student";
    els.studentDbId.value = student.student_id;
    els.studentCode.value = student.student_code;
    els.fullName.value = student.full_name;
    els.email.value = student.email;
    els.course.value = String(student.course_id);
    els.phoneNumber.value = student.phone_number;
    els.address.value = student.address;
    els.gender.value = student.gender;
    els.dateOfBirth.value = student.date_of_birth?.split("T")[0] || student.date_of_birth;

    openStudentModal();
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setLoading(false);
  }
}

async function deleteStudent(studentId) {
  const confirmed = window.confirm("Are you sure you want to delete this student?");
  if (!confirmed) return;

  try {
    setLoading(true);
    await apiRequest(`/students/${studentId}`, { method: "DELETE" });
    showToast("success", "Student deleted successfully");
    await fetchStudents();
    await fetchDashboard();
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setLoading(false);
  }
}

function goToPage(pageNumber) {
  state.pagination.page = pageNumber;
  fetchStudents().catch((error) => showToast("error", error.message));
}

function exportToCSV() {
  if (!state.students.length) {
    showToast("error", "No student data to export");
    return;
  }

  const headers = ["Student ID", "Name", "Email", "Course", "Phone", "Address", "Gender", "DOB"];
  const rows = state.students.map((s) => [
    s.student_code,
    s.full_name,
    s.email,
    s.course_name || "",
    s.phone_number,
    s.address,
    s.gender,
    formatDate(s.date_of_birth),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((item) => `"${String(item).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "students.csv";
  link.click();
  URL.revokeObjectURL(url);

  showToast("success", "CSV exported successfully");
}

function exportToPDF() {
  if (!state.students.length) {
    showToast("error", "No student data to export");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Smart Student Management - Students", 14, 15);

  const rows = state.students.map((s) => [
    s.student_code,
    s.full_name,
    s.email,
    s.course_name || "",
    s.phone_number,
    s.gender,
  ]);

  doc.autoTable({
    head: [["ID", "Name", "Email", "Course", "Phone", "Gender"]],
    body: rows,
    startY: 22,
  });

  doc.save("students.pdf");
  showToast("success", "PDF exported successfully");
}

function applyTheme() {
  const savedTheme = localStorage.getItem("sms_theme") || "light";
  document.body.classList.toggle("dark", savedTheme === "dark");
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("sms_theme", isDark ? "dark" : "light");
}

function logout() {
  localStorage.removeItem("sms_token");
  localStorage.removeItem("sms_user");
  state.token = "";
  state.user = null;
  els.appView.classList.add("hidden");
  els.loginView.classList.remove("hidden");
}

async function handleLogin(event) {
  event.preventDefault();

  try {
    setLoading(true);
    const formData = new FormData(els.loginForm);
    const payload = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {},
    });

    state.token = data.token;
    state.user = data.user;

    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(data.user));

    showToast("success", "Login successful");
    await initializeApp();
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setLoading(false);
  }
}

async function saveStudent(event) {
  event.preventDefault();

  try {
    const payload = getStudentPayload();
    const validationError = validateStudentForm(payload);
    if (validationError) {
      showToast("error", validationError);
      return;
    }

    setLoading(true);

    const studentId = els.studentDbId.value;
    const isEdit = Boolean(studentId);

    await apiRequest(isEdit ? `/students/${studentId}` : "/students", {
      method: isEdit ? "PUT" : "POST",
      body: JSON.stringify(payload),
      headers: {},
    });

    showToast("success", isEdit ? "Student updated" : "Student added");
    closeStudentModal();
    await fetchStudents();
    await fetchDashboard();
  } catch (error) {
    showToast("error", error.message);
  } finally {
    setLoading(false);
  }
}

function registerEvents() {
  els.loginForm.addEventListener("submit", handleLogin);
  els.logoutBtn.addEventListener("click", logout);
  els.addStudentBtn.addEventListener("click", prepareAddModal);
  els.closeModalBtn.addEventListener("click", closeStudentModal);
  els.studentForm.addEventListener("submit", saveStudent);
  els.exportCsvBtn.addEventListener("click", exportToCSV);
  els.exportPdfBtn.addEventListener("click", exportToPDF);
  els.themeToggleBtn.addEventListener("click", toggleTheme);

  let searchDebounce;
  els.searchInput.addEventListener("input", (event) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      state.filters.search = event.target.value.trim();
      state.pagination.page = 1;
      fetchStudents().catch((error) => showToast("error", error.message));
    }, 250);
  });

  els.courseFilter.addEventListener("change", (event) => {
    state.filters.courseId = event.target.value;
    state.pagination.page = 1;
    fetchStudents().catch((error) => showToast("error", error.message));
  });

  els.genderFilter.addEventListener("change", (event) => {
    state.filters.gender = event.target.value;
    state.pagination.page = 1;
    fetchStudents().catch((error) => showToast("error", error.message));
  });

  document.querySelectorAll("th[data-sort]").forEach((header) => {
    header.addEventListener("click", () => {
      const nextSort = header.dataset.sort;
      if (state.filters.sortBy === nextSort) {
        state.filters.sortOrder = state.filters.sortOrder === "ASC" ? "DESC" : "ASC";
      } else {
        state.filters.sortBy = nextSort;
        state.filters.sortOrder = "ASC";
      }

      fetchStudents().catch((error) => showToast("error", error.message));
    });
  });

  els.navItems.forEach((btn) => {
    btn.addEventListener("click", () => renderSection(btn.dataset.section));
  });

  els.studentModal.addEventListener("click", (event) => {
    if (event.target === els.studentModal) closeStudentModal();
  });
}

async function initializeApp() {
  try {
    setLoading(true);

    if (!state.token) {
      els.loginView.classList.remove("hidden");
      els.appView.classList.add("hidden");
      return;
    }

    els.adminBadge.textContent = state.user?.name || "Admin";

    els.loginView.classList.add("hidden");
    els.appView.classList.remove("hidden");

    await fetchCourses();
    await Promise.all([fetchDashboard(), fetchStudents()]);
  } catch (error) {
    showToast("error", `${error.message}. Please login again.`);
    logout();
  } finally {
    setLoading(false);
  }
}

window.openEditModal = openEditModal;
window.deleteStudent = deleteStudent;
window.goToPage = goToPage;

applyTheme();
registerEvents();
initializeApp();
