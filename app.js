const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const csrf = require("csurf");
const https = require("https");
const flash = require("connect-flash");
const multer = require("multer");
const compression = require("compression");
const errorController = require("./controllers/error");
const config = require("./config");
const PORT = config.PORT;
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const connectDB = require("./helpers/db");

const app = express();

const csrfProtection = csrf();

// Cors
const cors = require("cors");
const healthCheck = require("./util/healthCheck");
const corsOptions = {
  origin: config.ALLOWED_CLIENTS,
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
};
app.use(cors(corsOptions));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: config.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, resp, next) => {
  resp.locals.isAuthenticated = req.session.isLoggedIn;
  resp.locals.csrfToken = req.csrfToken();
  next();
});

//routes
app.get("/health-check", (req, res) =>
  res.status(200).json({ msg: "ecommerce server is all good" })
);
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, resp, next) => {
  console.log({ error });
  resp.redirect("/500");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
    (async function wakeup() {
      await healthCheck();
      setTimeout(wakeup, 600000); //10m
    })();
  })
  .catch((err) => {
    console.log(err);
  });
