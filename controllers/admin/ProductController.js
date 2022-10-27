const models = require("../../models");
const Product = models.Product;
const Stock = models.Stock;

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        online: true,
      },
    });

    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const product = {
    name: req.body.name,
    description: req.body.description,
    online: req.body.online,
    price: req.body.price,
    category: req.body.category,
    imageUrl: null,
  };

  if (req.fileValidationError) {
    res.status(400).json(req.fileValidationError);
  }

  product.imageUrl = req.file.filename;

  try {
    const data = await Product.create(product);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });

    await product.destroy();

    res.status(200).json({
      message: "Produit supprimé.",
    });
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
};

exports.createStock = async (req, res) => {
  const stock = {
    quantity: req.body.qty,
    shipperId: req.body.shipperId,
    productId: req.body.productId,
  };

  try {
    const stockExist = await Stock.findOne({
      where: {
        productId: stock.productId,
        shipperId: stock.shipperId,
      },
    });

    if (stockExist) {
      return res.status(400).json({ error: "Stock exist." });
    }

    const createdStock = await Stock.create(stock);
    res.status(201).json({ success: true, stock: createdStock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateStock = async (req, res) => {
  const data = {
    products: req.body.products,
    shipperId: req.body.shipperId,
  };

  try {
    data.products.forEach(async (product) => {
      try {
        const stock = await Stock.findOne({
          where: {
            productId: product.id,
            shipperId: data.shipperId,
          },
        });

        stock.quantity = product.qty;
        await stock.save();
      } finally {
        console.log("success");
      }
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }

  try {
    const stockExist = await Stock.findOne({
      where: {
        productId: stock.productId,
        shipperId: stock.shipperId,
      },
    });

    if (!stockExist) {
      return res.status(400).json({ error: "Don't exist." });
    }

    stockExist.quantity = stock.quantity;

    await stockExist.save();

    res.status(200).json({ status: true, stock: stockExist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
