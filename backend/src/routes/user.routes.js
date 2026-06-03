const express = require('express');
const verifyToken = require('../middleware/auth.middleware');

const {
  getProfile,
  getOrderHistory,
  updateProfile,
  updatePassword
} = require('../controllers/user.controller');

const router = express.Router();

router.put('/profile', verifyToken, updateProfile);
router.get('/orders', verifyToken, getOrderHistory);
router.put('/password', verifyToken, updatePassword);
router.get('/profile', verifyToken, getProfile); 

module.exports = router;