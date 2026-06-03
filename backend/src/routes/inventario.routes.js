const express = require('express');

const router = express.Router();

const verifyToken =
  require('../middleware/auth.middleware');

const adminMiddleware =
  require('../middleware/admin.middleware');

const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/inventario.controller');

router.get(
  '/',
  verifyToken,
  adminMiddleware,
  obtenerProductos
);

router.post(
  '/',
  verifyToken,
  adminMiddleware,
  crearProducto
);

router.put(
  '/:id',
  verifyToken,
  adminMiddleware,
  actualizarProducto
);

router.delete(
  '/:id',
  verifyToken,
  adminMiddleware,
  eliminarProducto
);

module.exports = router;