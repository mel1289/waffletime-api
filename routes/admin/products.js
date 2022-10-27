const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");
const storage = require("../../upload-config");
const upload = multer(storage);

const ProductController = require("../../controllers/admin/ProductController");

router.post("/", upload.single("image"), ProductController.createProduct);
router.post("/stock", ProductController.createStock)
router.put("/stock", ProductController.updateStock)
router.delete("/:id", ProductController.deleteProduct);
//router.get("/", ProductController.getAllProducts)

module.exports = router;
