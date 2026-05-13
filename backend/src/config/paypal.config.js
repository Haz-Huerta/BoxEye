const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  baseUrl: 'https://api-m.sandbox.paypal.com'
};

module.exports = { paypalConfig };