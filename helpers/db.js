const mongoose = require("mongoose");
const config = require("../config")
let MONGODB_URI = config.MONGODB_URI;

function connectDB() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(async () => {
        console.log("Connected successfully to database 😁😁😁");
        resolve(true);
      })
      .catch((error) => {
        console.log("Connection with DB failed ☹️☹️☹️☹️");
        console.log({error});
        reject(false);
      });
  });
}

module.exports = connectDB;