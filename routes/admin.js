const path = require("path");

const express = require("express");
const { body } = require("express-validator");

const adminController = require("../controllers/admin");

const jwtAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", jwtAuth.verifyToken, jwtAuth.isValidUser, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 400})
        .trim()   
  ],
  [jwtAuth.verifyToken, jwtAuth.isValidUser],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.getEditProduct);

router.post("/edit-product", [
    body('title')
        .isString()
        .isLength({min: 3})
        .trim(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 400})
        .trim()   
  ], [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.postEditProduct);

router.delete("/product/:productId", [jwtAuth.verifyToken, jwtAuth.isValidUser], adminController.deleteProduct);

module.exports = router;


