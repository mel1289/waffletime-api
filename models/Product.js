"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      // Tester STRING(45) ..
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      online: DataTypes.BOOLEAN,
      price: DataTypes.INTEGER,
      category: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      isNew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isWeekProduct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    },
    {}
  );
  Product.associate = function (models) {
    Product.hasMany(models.Stock, {
      foreignKey: "productId",
      as: "stocks",
    });
  };
  return Product;
};
