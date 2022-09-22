const { check, body } = require("express-validator");

const obj = {};

obj.checkDuplicateEmail = check("email")
  .isEmail()
  .withMessage("Please enter a valir email address.")
  .normalizeEmail()
  .custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (!user) {
        return Promise.reject("Invalid Email or Password.").then(() =>
          res.redirect("/login")
        );
      }
    });
  });

obj.simplePswrdCriteriaCheck = body(
  "password",
  "Please enter a password with only numbers and text and at least 5 characters"
)
  .isAlphanumeric()
  .isLength({ min: 5 })
  .trim();

obj.confirmPswrd = body("confirmPassword")
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match!");
    }
    return true;
  });

obj.productDetailVal = [
  body("title").isString().isLength({ min: 3 }).trim(),
  body("price").isFloat(),
  body("description").isLength({ min: 5, max: 400 }).trim(),
];
module.exports = obj;
