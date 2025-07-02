import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get('http://localhost:5000/api/expenses');
    setExpenses(res.data);
  };

  const addExpense = async () => {
    const res = await axios.post('http://localhost:5000/api/expenses', form);
    setExpenses([...expenses, res.data]);
    setForm({ title: '', amount: '', category: '' });
  };

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    setExpenses(expenses.filter(e => e._id !== id));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>💸 Budget & Expense Tracker</h1>

      <input
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        style={{ margin: '5px', padding: '8px' }}
      />
      <input
        type="number"
        value={form.amount}
        onChange={e => setForm({ ...form, amount: e.target.value })}
        placeholder="Amount"
        style={{ margin: '5px', padding: '8px' }}
      />
      <input
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        placeholder="Category"
        style={{ margin: '5px', padding: '8px' }}
      />
      <button onClick={addExpense} style={{ margin: '5px', padding: '8px' }}>
        Add
      </button>

      <ul>
        {expenses.map(exp => (
          <li key={exp._id} style={{ margin: '10px 0' }}>
            <strong>{exp.title}</strong> - ₹{exp.amount} [{exp.category}]
            <button
              onClick={() => deleteExpense(exp._id)}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
