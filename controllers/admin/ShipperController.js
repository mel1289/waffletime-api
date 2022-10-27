const Shipper = require("../../models/Shipper");
const ShipperNormalizer = require("../../normalizers/ShipperNormalizer");

exports.createShipper = (req, res) => {
  const shipper = new Shipper({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    postalCodes: req.body.postalCodes,
  });

  Shipper.count({
    $or: [
      { firstname: shipper.firstname },
      { lastname: shipper.lastname },
      { postalCodes: { $in: shipper.postalCodes } },
    ],
  })
    .then((count) => {
      if (count > 0) {
        res.status(409).json({
          message:
            "A postal code or an identity from the list is already used.",
        });
      } else {
        shipper
          .save()
          .then((shipper) => {
            res.status(201).json(ShipperNormalizer.normalize(shipper));
          })
          .catch((err) => {
            res.status(400).json({
              error: err.message,
            });
          });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

exports.getShippers = (req, res) => {
  Shipper.find()
    .then((shippers) => {
      const formattedData = shippers.map((shipper) => {
        return ShipperNormalizer.normalize(shipper);
      });

      res.status(200).json(formattedData);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

exports.getShipper = (req, res) => {
  Shipper.findOne({ _id: req.params.id })
    .then((shipper) => {
      res.status(200).json(ShipperNormalizer.normalize(shipper));
    })
    .catch((err) => {
      res.status(404).json({ error: "Shipper with this ID not found." });
    });
};

exports.deleteShipper = (req, res) => {
  Shipper.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "RIP :(",
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err.message,
      });
    });
};
