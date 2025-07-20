const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String // hashed
});
module.exports = mongoose.model('User', userSchema);