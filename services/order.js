const models = require("../models");
const Order = models.Order;
const OrderItems = models.OrderItems;
const Stock = models.Stock;

exports.cancelOrder = async (orderId, shipperId) => {
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
    
            console.log(`Stock before ${stock.quantity}`);
            stock.quantity += item.quantity;
            console.log(`Stock after ${stock.quantity}`);
    
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
        // Send email to manage manualy this Order (delete manualy OrderItems etc..)
        console.log(err);
      }
}