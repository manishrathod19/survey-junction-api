const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  emailId: String,
  password: String,
  createdAt: Date,
  updatedAt: Date,
});

module.export = mongoose.model("user", userSchema);
