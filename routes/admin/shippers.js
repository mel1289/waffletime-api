const express = require("express");
const router = express.Router();

const ShipperController = require("../../controllers/admin/ShipperController");

router.post("/", ShipperController.createShipper);
router.get("/", ShipperController.getShippers);
router.get("/:id", ShipperController.getShipper);
router.delete("/:id", ShipperController.deleteShipper);

module.exports = router;
