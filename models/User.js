const mongoose = require("mongoose");

const UserSchma = new mongoose.Schema(
  {
    username: { type: String, require: true },
    useremail: { type: String, require: true, unique: true },
    password: { type: String, require: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchma);
