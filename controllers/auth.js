const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config")
const { validationResult } = require("express-validator");

const User = require("../models/user");


exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({ email: email })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then(async(doMatch) => {
          
          if (doMatch) {
            let token = await jwt.sign({ id: user._id, email:user.email}, config.JWT_SECRET, {
              expiresIn: 86400, // 24 hours
            });
            req.session.token=token;
            req.session.isLoggedIn=true;
            delete user.password;
            req.user=user;
            return res.redirect("/");
          }
          res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: 'Invalid email or password',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch((e) => {
          console.log(e)
          res.redirect('/login')
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if(err)console.log(err);
    res.redirect("/");
  });
};