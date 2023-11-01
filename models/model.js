const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true, minlength: 10 },
  password: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;