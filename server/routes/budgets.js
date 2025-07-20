const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');


// Get all budgets for the logged-in user
router.get('/',async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new budget for the logged-in user
router.post('/', async (req, res) => {
  const { category, amount, month } = req.body;
  try {
    const newBudget = new Budget({

      category,
      amount,
      month
    });
    await newBudget.save();
    res.json(newBudget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;