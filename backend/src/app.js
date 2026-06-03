const express = require('express');
const cors = require('cors');

const productosRoutes = require('./routes/productos.routes');
const paypalRoutes = require('./routes/paypal.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();
const inventarioRoutes =
  require('./routes/inventario.routes');
const db = require('./config/db');

app.use(express.json());

db.query('SELECT 1')
  .then(() => console.log('Conexión a MySQL exitosa'))
  .catch(err => console.error(err));

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  '/api/inventario',
  inventarioRoutes
);
app.use('/api/pedido', pedidoRoutes);
app.use('/api', productosRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;