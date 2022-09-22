require("dotenv").config();
exports.JWT_SECRET = process.env.JWT_SECRET || "UKVKYEIF6FD6!#$@%$5F"
exports.MONGODB_URI=process.env.MONGODB_URI
exports.PORT = process.env.PORT || 3000;
module.export = exports