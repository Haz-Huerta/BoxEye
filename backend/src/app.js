const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const app = express();
const db = require('./config/db');
const paypalRoutes = require('./routes/paypal.routes');
db.query('SELECT 1')
    .then(() => console.log('Conexión a MySQL exitosa (Base de datos: boxeye)'))
    .catch(err => console.error('Error conectando a la base de datos:', err));
app.use(cors());
app.use(express.json());
app.use('/api', productosRoutes);
app.use('/api/paypal', paypalRoutes);
module.exports = app;