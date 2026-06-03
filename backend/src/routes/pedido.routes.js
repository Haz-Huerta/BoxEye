const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth.middleware');

const {
  crearPedido
} = require('../controllers/pedido.controller');

router.post(
  '/',
  verifyToken,
  crearPedido
);

module.exports = router;