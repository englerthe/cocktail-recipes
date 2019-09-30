const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {type: String},
  lastname: {type: String},
  username: {type: String, unique: true},
  email: {type: String},
  password: {type: String}
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema );
module.exports = User;