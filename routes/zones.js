const express = require("express");
const router = express.Router();

const ZoneController = require("../controllers/ZoneController");

router.get("/", ZoneController.getZones);
router.get("/:postalCode", ZoneController.getZone);

module.exports = router;
