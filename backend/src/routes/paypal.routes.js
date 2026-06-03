const express = require('express');
const router = express.Router();
const {createOrder, captureOrder} = require('../controllers/paypal.controller');
const verifyToken = require('../middleware/auth.middleware');
router.post(
  '/create-order',
  verifyToken,
  createOrder
);
router.post('/capture-order', captureOrder);
module.exports = router;