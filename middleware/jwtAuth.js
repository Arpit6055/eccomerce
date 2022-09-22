const jwt = require("jsonwebtoken");
const config = require("../config");
const user = require("../models/user");

let verifyToken  = (req, res, next) => {
  let token = req.session.token;
  if (!token) {
    return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: 'Session expired',
        oldInput: {
          email: "",
          password: ""
        },
        validationErrors: []
      });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
        return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: 'Unauthorized!!',
            oldInput: {
              email: "",
              password: ""
            },
            validationErrors: []
          });
    }

    req.userId = decoded.id;
    req.email = decoded.email;
    next();
  });
};


let isValidUser = (req,res,next)=>{
    user.findOne({_id:req.userId, email:req.email}).exec((err, user)=>{
        if (err) {
            return res.status(422).render("auth/login", {
                path: "/login",
                pageTitle: "Login",
                errorMessage: 'No such user found!',
                oldInput: {
                  email: req.email || "",
                  password: ""
                },
                validationErrors: []
            });
        }
        else if(user) {
          req.user=user;
          next();
        }
    });
};

let jwtAuth = {isValidUser, verifyToken};
module.exports = jwtAuth;