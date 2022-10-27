const models = require("../models");
const db = require("../models");
const Product = models.Product;
const ProductNormalizer = require("../normalizers/ProductNormalizer");
const { logger } = require("../logger");

exports.getProducts = (req, res) => {
  const shipperId = req.params.shipperId;

  const query = `SELECT * FROM Stocks INNER JOIN Products WHERE Stocks.productId = Products.id AND Stocks.shipperId = '${shipperId}' AND online = 1 ORDER BY category`;

  db.sequelize
    .query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((products) => {
      const formattedData = products.map((product) => {
        return ProductNormalizer.normalize(product);
      });

      res.status(200).json(formattedData);
    })
    .catch((error) => {
      logger.error({
        type: "Get all products",
        err: err.message,
      });
      res.status(400).json({ error: error.message });
    });
};

exports.getProduct = (req, res) => {
  const shipperId = req.params.shipperId;
  const productId = req.params.productId;

  const query = `SELECT * FROM Stocks INNER JOIN Products WHERE Stocks.productId = Products.id AND Products.id = '${productId}' AND Stocks.shipperId = '${shipperId}'`;

  db.sequelize
    .query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((product) => {
      if (!product.length) {
        return res.status(404).json({ message: "Product not found." });
      }

      res.status(200).json(ProductNormalizer.normalize(product[0]));
    })
    .catch((error) => {
      logger.error({
        type: `Get product with id ${productId}`,
        err: err.message,
      });
      res.status(400).json({ error: error.message });
    });
};
