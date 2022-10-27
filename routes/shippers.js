const express = require("express");
const router = express.Router();

const ShipperController = require("../controllers/ShipperController");
const ProductController = require("../controllers/ProductController");

router.get(
  "/:shipperId/stock/:productId",
  ShipperController.getShipperProductQty
);

router.get("/get", ShipperController.getShippers);

router.get("/:shipperId/products", ProductController.getProducts);
router.get("/:shipperId/products/:productId", ProductController.getProduct);

router.post("/:shipperId/getDeliveryTime", ShipperController.getDeliveryTime);

module.exports = router;
