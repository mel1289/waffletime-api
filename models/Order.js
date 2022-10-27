"use strict";

const { model } = require("mongoose");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      totalPrice: DataTypes.INTEGER,
      paymentType: DataTypes.STRING,
      status: DataTypes.STRING,
      shipperId: DataTypes.UUID,
      zoneId: DataTypes.UUID,
      paymentIntentId: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      plannedAt: DataTypes.DATE,
      deliveredAt: DataTypes.DATE,
      ip: DataTypes.STRING,
    },
    {}
  );
  Order.associate = function (models) {
    Order.hasMany(models.OrderItems, {
      foreignKey: "orderId",
      as: "items"
    })
  };
  return Order;
};
