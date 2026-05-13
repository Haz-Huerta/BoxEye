const express = require('express');

const router = express.Router();

const {
  crearPedido
} = require('../controllers/pedido.controller');

router.post('/', crearPedido);

module.exports = router;