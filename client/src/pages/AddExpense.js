import React, { useState } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [form, setForm] = useState({ title: '', amount: '', category: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/expenses', form);
    alert('Expense added!');
    setForm({ title: '', amount: '', category: '' });
  };

  return (
    <div>
      <h2>➕ Add Expense</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-control" placeholder="Title" required />
        </div>
        <div className="col-md-4">
          <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })} className="form-control" placeholder="Amount" required />
        </div>
        <div className="col-md-4">
          <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="form-control" placeholder="Category" required />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;