const express = require("express");
const router = express.Router();

const ZoneController = require("../../controllers/admin/ZoneController");

router.post("/", ZoneController.createZone);
router.delete("/:id", ZoneController.deleteZone);

module.exports = router;
