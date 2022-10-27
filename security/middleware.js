exports.isAdministrator = (req, res, next) => {
  const allowedIps = ["::ffff:127.0.0.1", "127.0.0.1", "81.185.166.15", "::1"];

  if (!allowedIps.includes(req.ip)) {
    return res.status(401).json("Unauthorized.");
  }

  next();
};
