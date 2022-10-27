const models = require("../models");
const db = require("../models");
const Order = models.Order;
const OrderItems = models.OrderItems;
const Stock = models.Stock;
const moment = require("moment");
const sendOrderResume = require("../services/mailers/sendOrderResume");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { logger } = require("../logger");
require("moment/locale/fr");
moment.locale("fr");

const cancelOrder = async (orderId, shipperId) => {
  try {
    const items = await OrderItems.findAll({
      where: {
        orderId: orderId,
      },
    });

    items.forEach(async (item) => {
      try {
        const stock = await Stock.findOne({
          where: {
            productId: item.productId,
            shipperId: shipperId,
          },
        });

        stock.quantity += item.quantity;

        await stock.save();
      } finally {
        console.log(
          `restockProducts called. orderId: ${orderId} shipperId: ${shipperId}`
        );
      }
    });

    await OrderItems.destroy({
      where: {
        orderId: orderId,
      },
    });

    await Order.destroy({
      where: {
        id: orderId,
      },
    });
  } catch (err) {
    logger.error({
      type: "cancelOrder",
      err: err.message,
      data: { orderId: orderId },
    });
    console.log(err);
  }
};

const cancelPaymentIntent = async (paymentId) => {
  try {
    await stripe.paymentIntents.cancel(paymentId);
  } catch (err) {
    logger.error({
      type: "cancelPaymentIntent",
      err: err.message,
      data: { paymentId: paymentId },
    });
    console.log(err);
  }
};

const createItemsAndUpdateQty = async (productsCart, orderId, shipperId) => {
  return new Promise((resolve, reject) => {
    productsCart.forEach(async (item) => {
      try {
        const stock = await Stock.findOne({
          where: { productId: item.productId, shipperId: shipperId },
        });

        if (!stock.id) {
          throw Error(
            `Stock not found. {productId: ${item.productId}, shipperId: ${shipperId}}`
          );
        }

        stock.quantity -= item.qty;

        if (stock.quantity < 0) stock.quantity = 0;

        const newItem = {
          quantity: item.qty,
          orderId: orderId,
          productId: item.productId,
        };

        const orderItem = await OrderItems.create(newItem);
        console.log("Called");
        const stockSave = await stock.save();

        if (!stockSave.id || !orderItem.id) {
          throw Error("OrderItems creation or stock update failed.");
        }

        resolve({ success: true });
      } catch (error) {
        logger.error({
          type: "createItemsAndUpdateQty",
          err: err.message,
          data: { orderId: orderId },
        });
        console.log(error);
        reject({ success: false });
      }
    });
  });
};

exports.newPayment = async (req, res) => {
  const { cart, customer } = req.body;

  let paymentData = null;
  let orderId = null;
  let shipperId = customer.shipperId;

  const newOrder = {
    firstname: customer.firstname,
    lastname: customer.lastname,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    totalPrice: cart.totalPrice,
    paymentType: req.body.type,
    status: "waiting",
    shipperId: customer.shipperId,
    zoneId: customer.shipperId,
    lat: customer.lat,
    lng: customer.lng,
    paymentIntentId: null,
    createdAt: new Date(),
    plannedAt: moment(customer.plannedAt).set("seconds", 0),
    deliveredAt: null,
    ip: req.ip
  };

  try {
    if (newOrder.paymentType == "card") {
      paymentData = await stripe.paymentIntents.create({
        amount: cart.totalPrice,
        currency: "eur",
        description: "Vente durant le service de nuit.",
        payment_method: req.body.id,
      });

      if (!paymentData.id) {
        throw Error("Stripe paymentIntents creation failed.", paymentData);
      }

      newOrder.paymentIntentId = paymentData.id;
    }

    const orderData = await Order.create(newOrder);

    if (!orderData.id) {
      throw Error("Order creation failed.");
    }

    orderId = orderData.id;

    const createItemsRes = await createItemsAndUpdateQty(
      cart.products,
      orderData.id,
      customer.shipperId
    );

    if (!createItemsRes.success) {
      throw Error("Item creation or Stock update failed.");
    }

    if (newOrder.paymentType == "card") {
      const confirmPayment = await stripe.paymentIntents.confirm(
        paymentData.id
      );

      if (confirmPayment.status != "succeeded") {
        throw Error("Payment not confirmed.");
      }
    }

    sendOrderResume({
      email: newOrder.email,
      firstname: newOrder.firstname,
      address: newOrder.address,
      plannedAt: moment(newOrder.plannedAt).format("HH:mm"),
      day: moment(newOrder.plannedAt).format("ddd, DD, MMM, YYYY"),
      id: orderData.id,
      totalPrice: newOrder.totalPrice,
      cart: cart.products,
      paymentType: newOrder.paymentType,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    if (paymentData != null) cancelPaymentIntent(paymentData.id);
    if (orderId != null) cancelOrder(orderId, shipperId);

    console.log(err);
    logger.error({ type: "Payment", err: err.message, data: newOrder });

    res.status(400).json({ err: err.message });
  }
};
