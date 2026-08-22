const express = require("express");
const router = express.Router({ mergeParams: true }); // needed to access :tripId
const {
  addStop,
  getStops,
  updateStop,
  deleteStop,
  reorderStops
} = require("../controllers/stopsController");

router.post("/", addStop);
router.get("/", getStops);
router.patch("/reorder", reorderStops);
router.patch("/:stopId", updateStop);
router.delete("/:stopId", deleteStop);

module.exports = router;