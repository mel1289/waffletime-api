const models = require("../../models");
const Order = models.Order;
const OrderItems = models.OrderItems;
const moment = require("moment");
const { Op } = require("sequelize");
const { cancelOrder } = require("../../services/order");

exports.getAll = async (req, res) => {
  const shipperId = req.params.shipperId;

  try {
    const orders = await Order.findAll({
      where: {
        shipperId: shipperId,
        [Op.or]: [{ status: "picked" }, { status: "waiting" }],
      },
      include: [
        {
          model: OrderItems,
          as: "items",
          attributes: ["quantity"],
          include: [{ model: models.Product, attributes: ["name"] }],
        },
      ],
      order: [["plannedAt", "ASC"]],
    });

    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const shipperId = req.params.shipperId;

  const { orderId } = req.body;

  try {
    await cancelOrder(orderId, shipperId);
    res.status(200).json("ok");
  } catch (err) {
    res.status(400).json({err: err.message})
  }
};

exports.updateOrder = async (req, res) => {
  const shipperId = req.params.shipperId;

  const { orderId, status } = req.body;

  try {
    const order = await Order.findOne({
      where: {
        id: orderId,
        shipperId: shipperId,
      },
    });

    order.status = status;
    order.deliveredAt = moment().format();

    await order.save();

    res.status(201).json("success");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};
