const models = require("../models");
const Stock = models.Stock;
const Zone = models.Zone;
const Order = models.Order;
const Shipper = models.Shipper;
const {
  calculDeliveryTime,
  searchDeliverySlotAviability,
} = require("../services/delivery");
const moment = require("moment");
const { Op, or } = require("sequelize");
const constants = require("../config/constants");

exports.getShippers = async (req, res) => {
  try {
    const shippers = await Shipper.findAll({
      include: [
        {
          model: Zone,
          as: "zones",
          attributes: ["postalCode", "city", "department"],
        },
      ],
    });

    res.status(200).json(shippers);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

exports.getShipperProductQty = (req, res) => {
  const shipperId = req.params.shipperId;
  const productId = req.params.productId;

  Stock.findOne({
    where: { shipperId: shipperId, productId: productId },
    attributes: ["quantity"],
  })
    .then((quantity) => {
      if (quantity == null) {
        return res.status(404).json({ message: "No result." });
      }
      res.status(200).json(quantity);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

exports.getDeliveryTime = async (req, res) => {
  const shipperId = req.params.shipperId;
  let { address } = req.body;
  let orderDate = moment();

  if (moment(orderDate).get("hours") < 19 && moment(orderDate).get("hours") > 3)
    orderDate = moment(orderDate).hours(19).minutes(0).seconds(0);

  try {
    const firstOrder = await Order.findOne({
      where: {
        shipperId: shipperId,
        status: {
          [Op.or]: ["waiting", "picked"],
        },
        createdAt: {
          [Op.gte]: moment().startOf("day"),
        },
        plannedAt: {
          [Op.gte]: orderDate.format(),
        },
      },
      order: [["plannedAt", "ASC"]],
    });

    if (!firstOrder) {
      // chercher la dernière commande s'il y a, le livreur reste sur place et le temps de livraison
      // de la prochaine commande sera calculé sur cette position ...
      const distanceTime = calculDeliveryTime(
        constants.KITCHEN_COORDS,
        address
      );

      return res.status(200).json({
        plannedAt: moment(orderDate).add(distanceTime, "minutes").format(),
      });
    }

    const planned = await searchDeliverySlotAviability(firstOrder, address);

    res.status(200).json({
      plannedAt: planned,
    });
  } catch (err) {
    logger.error({
      type: "Get delivery time",
      err: err.message,
    });
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
