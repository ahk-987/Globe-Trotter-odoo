const express = require("express");
const router = express.Router({ mergeParams: true });
const { getTripBudget, addBudgetItem } = require("../controllers/budgetController");

router.get("/", getTripBudget);
router.post("/", addBudgetItem);

module.exports = router;