const models = require("../models");
const Zone = models.Zone;
const Shipper = models.Shipper;
const { logger } = require("../logger")

exports.getZones = (req, res) => {
  Zone.findAll()
    .then((zones) => {
      res.status(200).json(zones);
    })
    .catch((err) => {
      logger.error({
        type: "Get all zones",
        err: err.message,
      });
      res.status(400).json({ error: err.message });
    });
};

exports.getZone = (req, res) => {
  const postalCode = Number(req.params.postalCode);

  if (isNaN(postalCode) || postalCode < 0) {
    return res.status(400).json({ error: "Bad request." });
  }

  Zone.findOne({
    where: { postalCode: postalCode },
  })
    .then((shipper) => {
      if (shipper == null) {
        return res.status(404).json({ message: "No results." });
      }

      res.status(200).json({ zone: shipper });
    })
    .catch((error) => {
      logger.error({
        type: `Get zone with postalcode ${postalCode}`,
        err: err.message,
      });
      res.status(400).json({ error: error.message });
    });
};
