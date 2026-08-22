const pool = require("../db");

// GET /api/activities?cityId=1&category=food
async function searchActivities(req, res) {
  try {
    const { cityId, category } = req.query;

    let query = "SELECT * FROM activities WHERE 1=1";
    const params = [];

    if (cityId) {
      params.push(cityId);
      query += ` AND city_id = $${params.length}`;
    }
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += " ORDER BY name ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to search activities" });
  }
}

// POST /api/stops/:stopId/activities — assign a catalog activity to a stop
async function assignActivity(req, res) {
  try {
    const { stopId } = req.params;
    const { activityId, scheduledDate, scheduledTime, costOverride, notes } = req.body;

    if (!activityId) {
      return res.status(400).json({ message: "activityId is required" });
    }

    const result = await pool.query(
      `INSERT INTO trip_activities (trip_stop_id, activity_id, scheduled_date, scheduled_time, cost_override, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [stopId, activityId, scheduledDate, scheduledTime, costOverride, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign activity" });
  }
}

// GET /api/stops/:stopId/activities — activities assigned to a stop
async function getStopActivities(req, res) {
  try {
    const { stopId } = req.params;

    const result = await pool.query(
      `SELECT ta.*, a.name, a.category, a.description, a.cost AS base_cost, a.duration_hours
       FROM trip_activities ta
       JOIN activities a ON a.id = ta.activity_id
       WHERE ta.trip_stop_id = $1
       ORDER BY ta.scheduled_date ASC, ta.scheduled_time ASC`,
      [stopId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stop activities" });
  }
}

async function removeActivity(req, res) {
  try {
    const { tripActivityId } = req.params;
    const result = await pool.query(
      "DELETE FROM trip_activities WHERE id = $1 RETURNING id",
      [tripActivityId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Activity assignment not found" });
    }

    res.json({ message: "Activity removed from stop" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove activity" });
  }
}

module.exports = { searchActivities, assignActivity, getStopActivities, removeActivity };