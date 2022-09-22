const jwtAuth = require('../middleware/jwtAuth')

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', [jwtAuth.verifyToken, jwtAuth.isValidUser], shopController.getCart);

router.post('/cart', [jwtAuth.verifyToken, jwtAuth.isValidUser], shopController.postCart);

router.post('/cart-delete-item', [jwtAuth.verifyToken, jwtAuth.isValidUser], shopController.postCartDeleteProduct);

module.exports = router;
