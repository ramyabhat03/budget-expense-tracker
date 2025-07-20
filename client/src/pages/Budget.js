import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Table } from 'react-bootstrap';

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Others'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', month: '' }); // Added month

  useEffect(() => {
    axios.get('http://localhost:5000/api/budgets')
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/budgets', form)
      .then(() => axios.get('http://localhost:5000/api/budgets'))
      .then(res => setBudgets(res.data));
    setForm({ category: '', amount: '', month: '' }); // Reset month
  };

  return (
    <Container className="mt-4">
      <h3>Set Budget</h3>
      <Form onSubmit={handleSubmit} className="w-50 mb-4">
        <Form.Group className="mb-3">
          <Form.Select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select
            value={form.month}
            onChange={e => setForm({ ...form, month: e.target.value })}
            required
          >
            <option value="">Select a month</option>
            {months.map((month, idx) => (
              <option key={idx} value={month}>{month}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">Add Budget</Button>
      </Form>

      <h5>Current Budgets</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Category</th>
            <th>Month</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b, i) => (
            <tr key={i}>
              <td>{b.category}</td>
              <td>{b.month}</td>
              <td>₹{b.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Budget;
