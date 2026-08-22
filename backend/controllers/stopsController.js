const pool = require("../db");

async function addStop(req, res) {
  try {
    const { tripId } = req.params;
    const { cityId, startDate, endDate, sequenceOrder } = req.body;

    if (!cityId) {
      return res.status(400).json({ message: "cityId is required" });
    }

    // if sequenceOrder not provided, put it at the end
    let order = sequenceOrder;
    if (order === undefined) {
      const countResult = await pool.query(
        "SELECT COUNT(*) FROM trip_stops WHERE trip_id = $1",
        [tripId]
      );
      order = parseInt(countResult.rows[0].count, 10);
    }

    const result = await pool.query(
      `INSERT INTO trip_stops (trip_id, city_id, sequence_order, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tripId, cityId, order, startDate, endDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add stop" });
  }
}

async function getStops(req, res) {
  try {
    const { tripId } = req.params;

    const result = await pool.query(
      `SELECT ts.*, c.name AS city_name, c.country
       FROM trip_stops ts
       JOIN cities c ON c.id = ts.city_id
       WHERE ts.trip_id = $1
       ORDER BY ts.sequence_order ASC`,
      [tripId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stops" });
  }
}

async function updateStop(req, res) {
  try {
    const { stopId } = req.params;
    const { startDate, endDate, sequenceOrder } = req.body;

    const result = await pool.query(
      `UPDATE trip_stops
       SET start_date = COALESCE($1, start_date),
           end_date = COALESCE($2, end_date),
           sequence_order = COALESCE($3, sequence_order)
       WHERE id = $4
       RETURNING *`,
      [startDate, endDate, sequenceOrder, stopId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stop not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update stop" });
  }
}

async function deleteStop(req, res) {
  try {
    const { stopId } = req.params;
    const result = await pool.query("DELETE FROM trip_stops WHERE id = $1 RETURNING id", [stopId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stop not found" });
    }

    res.json({ message: "Stop deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete stop" });
  }
}

// bulk reorder — frontend sends the new order after a drag-and-drop
async function reorderStops(req, res) {
  try {
    const { tripId } = req.params;
    const { orderedStopIds } = req.body; // e.g. [3, 1, 2]

    if (!Array.isArray(orderedStopIds)) {
      return res.status(400).json({ message: "orderedStopIds must be an array" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      for (let i = 0; i < orderedStopIds.length; i++) {
        await client.query(
          "UPDATE trip_stops SET sequence_order = $1 WHERE id = $2 AND trip_id = $3",
          [i, orderedStopIds[i], tripId]
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    res.json({ message: "Stops reordered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reorder stops" });
  }
}

module.exports = { addStop, getStops, updateStop, deleteStop, reorderStops };