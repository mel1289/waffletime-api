const { getDistance, convertDistance } = require("geolib");
const models = require("../models");
const { Op, or } = require("sequelize");
const Order = models.Order;
const moment = require("moment");
const constants = require("../config/constants");
const { logger } = require("../logger")

/**
 *
 * @param {Object} start  (lat & lng)
 * @param {Object} end (lat & lng)
 */
exports.calculDeliveryTime = (start, end) => {
  const distance = convertDistance(getDistance(start, end, 1), "km");

  return Math.round(distance * constants.TIME_PER_KM + constants.TIME_SECURITY); // return minuts
};

exports.searchDeliverySlotAviability = async (firstOrder, address) => {
  try {
    const nextOrder = await Order.findOne({
      where: {
        shipperId: firstOrder.shipperId,
        status: {
          [Op.or]: ["waiting", "picked"],
        },
        id: {
          [Op.ne]: firstOrder.id,
        },
        createdAt: {
          [Op.gte]: moment().startOf("day"),
        },
        plannedAt: {
          [Op.gt]: moment(firstOrder.plannedAt).format(),
        },
      },
      order: [["plannedAt", "ASC"]],
    });

    const distanceTime = this.calculDeliveryTime(address, {
      lat: firstOrder.lat,
      lng: firstOrder.lng,
    });

    const plannedDate = moment(firstOrder.plannedAt)
      .add(distanceTime, "minutes")
      .format();

    if (!nextOrder) {
      return plannedDate;
    }

    if (nextOrder.status == "picked")
      return this.searchDeliverySlotAviability(nextOrder, address);

    if (
      nextOrder &&
      moment(plannedDate)
        .add(
          this.calculDeliveryTime(address, {
            lat: nextOrder.lat,
            lng: nextOrder.lng,
          }),
          "minutes"
        )
        .format() >=
        moment(nextOrder.plannedAt)
          .add(constants.DELIVERY_MAX_DELAY, "minutes")
          .format()
    ) {
      return this.searchDeliverySlotAviability(nextOrder, address);
    }

    return plannedDate;
  } catch (err) {
    logger.error({
      type: "Get delivery time",
      err: err.message,
    });
    console.log(err);
  }
};
