"use strict";
module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define(
    "OrderItems",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      quantity: DataTypes.INTEGER,
    },
    {}
  );
  OrderItems.associate = function (models) {
    OrderItems.belongsTo(models.Order, {
      foreignKey: "orderId",
    });

    OrderItems.belongsTo(models.Product, {
      foreignKey: "productId",
    });
  };
  return OrderItems;
};
