const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const sendMail = require('../sendMail');

var source = fs.readFileSync(path.join(__dirname, 'order-resume.hbs'), 'utf8');
var template = Handlebars.compile(source);

Handlebars.registerHelper('getPrice', (price) => {
  return parseFloat(price / 100).toFixed(2)
})

Handlebars.registerHelper('isPayed', (paymentType) => {
  return paymentType == "card"
})

var options = (email, locals) => {
  //logger.log('info', `Sending password reset email to ${email}.`, {tags: 'email'});
  return {
    from: "",
    to: email,
    subject: "",
    html: template(locals)
  };
};

module.exports = (order) => {
  return sendMail(options(order.email, order));
}