const mongoose = require('mongoose');
const budgetSchema = new mongoose.Schema({
  userId: String,
  category: String,
  amount: Number,
  month: String
});
module.exports = mongoose.model('Budget', budgetSchema);
