const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// Add new expense
router.post('/', async (req, res) => {
  const { title, amount, category } = req.body;
  const newExpense = new Expense({ title, amount, category });
  await newExpense.save();
  res.json(newExpense);
});

// Delete expense
router.delete('/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense deleted' });
});

module.exports = router;
