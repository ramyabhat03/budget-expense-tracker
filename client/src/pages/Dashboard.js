import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF0055'];

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ category: '', month: '' });
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses')
      .then(res => {
        setExpenses(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/api/budgets')
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));

    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/suggestions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setInsights(res.data))
      .catch(err => console.error("Suggestions fetch error:", err));
  }, []);

  const handleFilter = () => {
    let result = expenses;
    if (filters.category)
      result = result.filter(e => e.category === filters.category);
    if (filters.month)
      result = result.filter(e => e.month === filters.month);
    setFiltered(result);
  };

  const categories = Array.from(new Set([
    ...expenses.map(e => e.category),
    ...budgets.map(b => b.category)
  ]));

  const chartData = categories.map(cat => {
    const totalExpense = filtered
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalBudget = budgets
      .filter(b => b.category === cat)
      .reduce((sum, b) => sum + Number(b.amount), 0);
    return {
      category: cat,
      expense: totalExpense,
      budget: totalBudget
    };
  });

  const barData = chartData;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const lineData = months.map(month => ({
    month,
    expense: filtered
      .filter(e => e.month === month)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  }));

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container className="mt-4">
      <h3>Dashboard</h3>

      <Form className="row g-3 mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Filter by Category"
            value={filters.category}
            onChange={e => setFilters({ ...filters, category: e.target.value })}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filters.month}
            onChange={e => setFilters({ ...filters, month: e.target.value })}
          >
            <option value="">All Months</option>
            {months.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Button onClick={handleFilter} variant="primary">Apply Filters</Button>
        </Col>
      </Form>

      {insights.length > 0 && (
        <Card className="p-3 mb-4">
          <h5>Smart Insights</h5>
          {insights.map((msg, idx) => (
            <Alert key={idx} variant="info">{msg}</Alert>
          ))}
        </Card>
      )}

      <Row>
        <Col md={6}>
          <Card className="p-3 mb-4">
            <h5>Total Expenses: ₹{total}</h5>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="budget"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#e2e2e2"
                  label
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`budget-${idx}`} fill="#e2e2e2" />
                  ))}
                </Pie>
                <Pie
                  data={chartData}
                  dataKey="expense"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={95}
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, idx) => (
                    <Cell key={`expense-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center small mt-2">
              <span className="me-3">
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#e2e2e2', marginRight: 4 }} />
                Budget
              </span>
              <span>
                <span style={{ display: 'inline-block', width: 12, height: 12, background: '#8884d8', marginRight: 4 }} />
                Expense
              </span>
            </div>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="p-3 mb-4">
            <h5>Budget vs Expense (Bar Chart)</h5>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#e2e2e2" name="Budget" />
                <Bar dataKey="expense" fill="#8884d8" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="p-3 mb-4">
            <h5>Monthly Expenses (Line Chart)</h5>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="expense" stroke="#8884d8" name="Expense" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
