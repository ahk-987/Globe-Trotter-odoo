const pool = require("../db");

async function getTripBudget(req, res) {
  try {
    const { tripId } = req.params;

    const activityCosts = await pool.query(
      `SELECT COALESCE(ta.cost_override, a.cost, 0) AS cost, a.category
       FROM trip_activities ta
       JOIN activities a ON a.id = ta.activity_id
       JOIN trip_stops ts ON ts.id = ta.trip_stop_id
       WHERE ts.trip_id = $1`,
      [tripId]
    );

    const manualItems = await pool.query(
      "SELECT category, amount AS cost FROM budget_items WHERE trip_id = $1",
      [tripId]
    );

    const all = [...activityCosts.rows, ...manualItems.rows];

    const breakdown = {};
    let total = 0;

    for (const row of all) {
      const cost = parseFloat(row.cost) || 0;
      const category = row.category || "other";
      breakdown[category] = (breakdown[category] || 0) + cost;
      total += cost;
    }

    res.json({ tripId, total, breakdown });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate budget" });
  }
}

async function addBudgetItem(req, res) {
  try {
    const { tripId } = req.params;
    const { category, amount } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({ message: "category and amount are required" });
    }

    const result = await pool.query(
      `INSERT INTO budget_items (trip_id, category, amount)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tripId, category, amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add budget item" });
  }
}

module.exports = { getTripBudget, addBudgetItem };