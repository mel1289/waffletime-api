"use strict";
module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define(
    "Zone",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      postalCode: DataTypes.INTEGER,
      city: DataTypes.STRING,
      department: DataTypes.STRING,
    },
    { timestamps: false }
  );
  Stock.associate = function (models) {
    Stock.belongsTo(models.Shipper, {
      foreignKey: "shipperId",
      onDelete: "CASCADE",
    });
  };
  return Stock;
};
