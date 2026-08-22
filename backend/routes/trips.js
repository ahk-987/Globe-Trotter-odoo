const express = require("express");
const router = express.Router();
const { createTrip, getTrips, getTripById } = require("../controllers/tripsController");

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTripById);

module.exports = router;