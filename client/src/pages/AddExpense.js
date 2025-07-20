import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';

const AddExpense = () => {
  const [form, setForm] = useState({ title: '', amount: '', category: '', month: '' });
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Others'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/budgets')
      .then(res => setBudgets(res.data));
    axios.get('http://localhost:5000/api/expenses')
      .then(res => setExpenses(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate total spent for this category and month
    const totalSpent = expenses
      .filter(exp => exp.category === form.category && exp.month === form.month)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    // Find the budget for this category and month
    const budget = budgets.find(b => b.category === form.category && b.month === form.month);

    if (budget && (totalSpent + Number(form.amount)) > budget.amount) {
      setMessage('Warning: This expense will exceed your budget for this category and month!');
      setVariant('warning');
      return; // Prevent adding the expense
    }

    try {
      await axios.post('http://localhost:5000/api/expenses', form);
      setMessage('Expense added!');
      setVariant('success');
      setForm({ title: '', amount: '', category: '', month: '' });

      // Update expenses state for real-time checking
      axios.get('http://localhost:5000/api/expenses')
        .then(res => setExpenses(res.data));
    } catch (err) {
      setMessage('Failed to add expense.');
      setVariant('danger');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header as="h5" className="bg-primary text-white">➕ Add New Expense</Card.Header>
            <Card.Body>
              {message && (
                <Alert variant={variant} onClose={() => setMessage('')} dismissible>
                  {message}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMonth">
                  <Form.Label>Month</Form.Label>
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

                <Button variant="primary" type="submit" className="w-100">
                  Add Expense
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddExpense;
