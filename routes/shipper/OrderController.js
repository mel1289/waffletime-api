const express = require("express");
const router = express.Router();

const OrderController = require("../../controllers/shipper/OrderController");

router.get("/:shipperId", OrderController.getAll);
router.post("/:shipperId", OrderController.updateOrder)
router.post("/cancel/:shipperId", OrderController.cancelOrder)

module.exports = router;