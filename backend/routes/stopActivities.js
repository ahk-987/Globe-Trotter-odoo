const express = require("express");
const router = express.Router({ mergeParams: true }); // needed to access :tripId and :stopId
const {
  assignActivity,
  getStopActivities,
  removeActivity
} = require("../controllers/activitiesController");

router.post("/", assignActivity);
router.get("/", getStopActivities);
router.delete("/:tripActivityId", removeActivity);

module.exports = router;