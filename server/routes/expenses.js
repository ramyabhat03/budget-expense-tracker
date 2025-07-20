const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new expense
router.post('/',  async (req, res) => {
  const { title, amount, category, month } = req.body;
  try {
    const newExpense = new Expense({ title, amount, category, month });
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense by ID
router.delete('/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;