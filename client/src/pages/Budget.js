import React, { useState, useEffect } from 'react';

const Budget = () => {
  const [budget, setBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/expenses')
      .then(res => res.json())
      .then(data => {
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        setTotalSpent(total);
      });
  }, []);

  const handleSet = () => {
    alert('Budget set!');
  };

  return (
    <div>
      <h2>💰 Set Budget</h2>
      <div className="mb-3">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="form-control"
          placeholder="Monthly Budget"
        />
      </div>
      <button onClick={handleSet} className="btn btn-success">Set Budget</button>
      <div className="mt-3">
        <p><strong>Total Spent:</strong> ₹{totalSpent}</p>
        {budget > 0 && totalSpent > budget && <p className="text-danger">⚠️ Over Budget!</p>}
      </div>
    </div>
  );
};

export default Budget;
