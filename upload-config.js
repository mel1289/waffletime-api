const multer = require("multer");
const path = require("path");

module.exports = {
  storage: new multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploads/");
    },
    filename: (req, file, callback) => {
      const name = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).split(".")[1];
      callback(null, name + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      req.fileValidationError = "Bad format, only .jpeg allowed.";
      return cb(null, false);
    }
  },
};
