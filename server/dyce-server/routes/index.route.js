const express = require("express");
const { checkHealth } = require("../controllers/health.controller");
const router = express.Router();

router.use("/auth", require("./auth.route"));
router.use("/matches", require("./matches.route"));
router.use("/profile", require("./profile.route"));
router.use("/blind-date", require("./blind_date.route"));
router.use("/settings", require("./settings.route"));
router.use("/messaging", require("./messaging.route"));

router.get("/healthy", checkHealth);


module.exports = router;
