const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

console.log("Starting backend...");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
  res.send('💸 Expense Tracker API is running!');
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
