const express = require("express");
const router = express.Router();
const {
  searchActivities,
  assignActivity,
  getStopActivities,
  removeActivity
} = require("../controllers/activitiesController");

router.get("/", searchActivities); // GET /api/activities?cityId=&category=

module.exports = router;