const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

router.get('/', async (req, res) => {
  const { month, prevMonth } = getCurrentAndPreviousMonth();

  // Aggregate expenses by category for current and previous month
  const curr = await Expense.aggregate([
    { $match: {  month } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);
  const prev = await Expense.aggregate([
    { $match: { month: prevMonth } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } }
  ]);
  const budgets = await Budget.find({ month });

  // Build suggestions
  let suggestions = [];
  curr.forEach(cat => {
    const prevCat = prev.find(p => p._id === cat._id);
    if (prevCat) {
      const diff = cat.total - prevCat.total;
      const percent = ((diff) / prevCat.total) * 100;
      if (percent > 10) {
        suggestions.push(`You spent ${percent.toFixed(1)}% more on ${cat._id} this month.`);
      }
    }
    const budget = budgets.find(b => b.category === cat._id);
    if (budget && cat.total > budget.amount) {
      suggestions.push(`You exceeded your ${cat._id} budget by ₹${(cat.total - budget.amount).toFixed(0)}.`);
    } else if (budget && cat.total < budget.amount) {
      suggestions.push(`Reduce ${cat._id} expenses by ₹${(budget.amount - cat.total).toFixed(0)} next month to save more.`);
    }
  });

  res.json(suggestions);
});

// Helper to get current and previous month as "July", "June", etc.
function getCurrentAndPreviousMonth() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const now = new Date();
  const month = months[now.getMonth()];
  const prevMonth = months[(now.getMonth() + 11) % 12];
  return { month, prevMonth };
}

module.exports = router;