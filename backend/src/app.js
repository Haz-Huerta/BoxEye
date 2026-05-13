const express = require('express');
const cors = require('cors');

const productosRoutes = require('./routes/productos.routes');
const paypalRoutes = require('./routes/paypal.routes');
const pedidoRoutes = require('./routes/pedido.routes');

const app = express();

const db = require('./config/db');


db.query('SELECT 1')
  .then(() => console.log('Conexión a MySQL exitosa'))
  .catch(err => console.error(err));

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/api/pedido', pedidoRoutes);
app.use('/api', productosRoutes);
app.use('/api/paypal', paypalRoutes);

module.exports = app;