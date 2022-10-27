"use strict";
module.exports = (sequelize, DataTypes) => {
  const Shipper = sequelize.define(
    "Shipper",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
    },
    {}
  );
  Shipper.associate = function (models) {
    Shipper.hasMany(models.Zone, {
      foreignKey: "shipperId",
      as: "zones",
    });
  };
  return Shipper;
};
