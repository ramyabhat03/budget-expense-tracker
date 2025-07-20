const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');
const transactionRoutes = require('./routes/transactions');
const suggestionsRoutes = require('./routes/suggestions'); // ✅ Added

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/transactions', transactionRoutes); // optional
app.use('/api/suggestions', suggestionsRoutes); // ✅ Registered

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
