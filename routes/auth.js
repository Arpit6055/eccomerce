const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const reqValidation = require("../middleware/reqValidation")

const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [reqValidation.checkDuplicateEmail,
    reqValidation.simplePswrdCriteriaCheck
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    reqValidation.checkDuplicateEmail,
    reqValidation.simplePswrdCriteriaCheck,
    reqValidation.confirmPswrd,
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
