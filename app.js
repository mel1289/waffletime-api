const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 4000;
const shippersRoute = require("./routes/shippers");
const zonesRoute = require("./routes/zones");
const ordersRoute = require("./routes/orders");
const adminShippersRoute = require("./routes/admin/shippers");
const adminProductsRoute = require("./routes/admin/products");
const adminZonesRoute = require("./routes/admin/zones");
const shipperOrderRoute = require("./routes/shipper/OrderController");
const sendOrderResume = require("./services/mailers/sendOrderResume");

const colorRed = "\x1b[41m";
const colorAuto = "\x1b[0m";

const { isAdministrator } = require("./security/middleware");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/shippers", shippersRoute);
app.use("/zones", zonesRoute);
app.use("/orders", ordersRoute);

app.use("/admin/shippers", isAdministrator, adminShippersRoute);
app.use("/admin/products", isAdministrator, adminProductsRoute);
app.use("/admin/zones", isAdministrator, adminZonesRoute);
app.use("/delivery", shipperOrderRoute);

app.use((req, res) => {
  res.status(404).json("Route not found.");
});

if (process.env.STRIPE_PRIVATE_KEY == null) {
  console.error(colorRed, "ERROR !! NO STRIPE PRIVATE KEY !!", colorAuto);
}

app.listen(port || 4000, () => console.log(`App listening on port ${port}`));
