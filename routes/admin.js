const reqValidation = require("../middleware/reqValidation")

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const jwtAuth = require("../middleware/jwtAuth");

const router = express.Router();

router.get("/add-product", jwtAuth.verifyToken, jwtAuth.isValidUser, adminController.getAddProduct);

router.get("/products", [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.getProducts);

router.post("/add-product",reqValidation.productDetailVal,[jwtAuth.verifyToken, jwtAuth.isValidUser],adminController.postAddProduct);

router.get("/edit-product/:productId", [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.getEditProduct);

router.post("/edit-product", reqValidation.productDetailVal, [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.postEditProduct);

router.delete("/product/:productId", [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.deleteProduct);

module.exports = router;


