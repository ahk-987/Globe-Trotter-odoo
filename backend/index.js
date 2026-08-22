const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const stopsRouter = require("./routes/stops");
const stopActivitiesRouter = require("./routes/stopActivities");

app.get("/", (req, res) => {
  res.json({ message: "GlobeTrotter API is running" });
});

app.use("/api/trips", require("./routes/trips"));
app.use("/api/trips/:tripId/stops", stopsRouter);
stopsRouter.use("/:stopId/activities", stopActivitiesRouter);
app.use("/api/trips/:tripId/budget", require("./routes/budget"));
app.use("/api/activities", require("./routes/activities"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});