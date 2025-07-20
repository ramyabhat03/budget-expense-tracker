import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button, Card, Badge, Row, Col } from 'react-bootstrap';

const Transactions = () => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
    axios.get('http://localhost:5000/api/budgets')
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));
  }, []);

  const deleteExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    setExpenses(prev => prev.filter(exp => exp._id !== id));
  };

  // Helper to get budget for category+month
  const getBudget = (category, month) => {
    const found = budgets.find(b => b.category === category && b.month === month);
    return found ? `₹${found.amount}` : <span className="text-muted">N/A</span>;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2 className="fw-bold text-primary">💸 Transactions</h2>
          <p className="text-muted">Track your expenses by category and month. See how they compare to your set budgets.</p>
        </Col>
      </Row>
      <Card className="shadow-sm">
        <Card.Body>
          <Table striped bordered hover responsive className="mt-3 align-middle">
            <thead className="table-primary">
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Month</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp._id}>
                  <td>{exp.title}</td>
                  <td>
                    <Badge bg="success" pill>
                      ₹{exp.amount}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="info">{exp.category}</Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">{exp.month || <span className="text-muted">N/A</span>}</Badge>
                  </td>
                  <td>
                    {getBudget(exp.category, exp.month)}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteExpense(exp._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {expenses.length === 0 && (
            <p className="text-muted text-center">No transactions to show.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transactions;
