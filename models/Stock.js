"use strict";
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define(
    "Stock",
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
  Stock.associate = function (models) {
    Stock.belongsTo(models.Shipper, {
      foreignKey: "shipperId",
      onDelete: "CASCADE",
    });

    Stock.belongsTo(models.Product, {
      foreignKey: "productId",
      onDelete: "CASCADE",
    });
  };
  return Stock;
};
