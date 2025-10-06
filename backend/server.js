const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise"); // promise-based
require("dotenv").config();

const app = express();
app.use(express.json());

// ------------------------------
// Serve Frontend
// ------------------------------
app.use(express.static(path.join(__dirname, "public"))); // frontend files

// ------------------------------
// MySQL connection pool
// ------------------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ------------------------------
// API route: Add student
// ------------------------------
app.post("/api/students", async (req, res) => {
  const { name, roll, email, phone, course, year, address } = req.body;

  if (!name || !roll || !email || !course || !year) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  try {
    const sql = `
      INSERT INTO students (name, roll, email, phone, course, year, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [name, roll, email, phone, course, year, address]);
    res.json({ message: "Student data saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error. Check logs." });
  }
});

// ------------------------------
// API route: Get all students (optional)
// ------------------------------
app.get("/api/students", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error." });
  }
});

// ------------------------------
// Fallback for SPA routing
// ------------------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ------------------------------
// Start server
// ------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
