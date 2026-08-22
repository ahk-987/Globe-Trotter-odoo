const pool = require("../db");

async function createTrip(req, res) {
  try {
    const { name, startDate, endDate, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Trip name is required" });
    }

    const result = await pool.query(
      `INSERT INTO trips (name, start_date, end_date, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, startDate, endDate, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create trip" });
  }
}

async function getTrips(req, res) {
  try {
    const result = await pool.query("SELECT * FROM trips ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
}

async function getTripById(req, res) {
  try {
    const result = await pool.query("SELECT * FROM trips WHERE id = $1", [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trip" });
  }
}

module.exports = { createTrip, getTrips, getTripById };