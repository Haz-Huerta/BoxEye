
const { paypalConfig } = require('../config/paypal.config');

function getBasicAuth() {

  return Buffer
    .from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`)
    .toString('base64');
}

async function getAccessToken() {

  const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getBasicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data.access_token;
}

async function createPaypalOrder(orderData) {

  const calculado = Number(
  orderData.items.reduce((acc, item) => {
    return acc + (Number(item.precio) * Number(item.cantidad));
  }, 0).toFixed(2)
);

const totalRecibido = Number(
  Number(orderData.total).toFixed(2)
);

if (calculado !== totalRecibido) {
  throw new Error(
    `El total no coincide con los items. Calculado: ${calculado}, Recibido: ${totalRecibido}`
  );
}

  const accessToken = await getAccessToken();

  const body = {
    intent: 'CAPTURE',

    purchase_units: [
      {
        amount: {
          currency_code: 'MXN',
          value: Number(orderData.total).toFixed(2),

          breakdown: {
            item_total: {
              currency_code: 'MXN',
              value: Number(orderData.total).toFixed(2)
            }
          }
        },

        items: orderData.items.map(item => ({
          name: item.nombre,

          quantity: String(item.cantidad),

          unit_amount: {
            currency_code: 'MXN',
            value: Number(item.precio).toFixed(2)
          }
        }))
      }
    ]
  };

  const response = await fetch(
    `${paypalConfig.baseUrl}/v2/checkout/orders`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

async function capturePaypalOrder(orderId) {

  const accessToken = await getAccessToken();

  const response = await fetch(
    `${paypalConfig.baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

module.exports = {
  createPaypalOrder,
  capturePaypalOrder
};