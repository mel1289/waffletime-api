const models = require("../../models");
const { Op } = require("sequelize");
const { post } = require("../../routes/zones");
const Zone = models.Zone;

exports.createZone = async (req, res) => {
  const { postalCode, city, department, shipperId } = req.body;

  const zone = {
    postalCode: postalCode,
    city: city,
    department: department,
    shipperId: shipperId,
  };

  try {
    const exist = await Zone.findAll({
      where: {
        [Op.or]: [
          {
            postalCode: {
              [Op.eq]: postalCode,
            },
          },
          {
            city: {
              [Op.eq]: city,
            },
          },
        ],
      },
    });

    if (exist.length != 0) {
      throw Error("Zone already exist.");
    }

    const data = await Zone.create(zone);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const data = await Zone.destroy({ where: { id: req.params.id } });
    if (data == false) {
      throw Error("Invalid ID");
    }
    res.status(200).json({ success: true, message: "Zone deleted." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
