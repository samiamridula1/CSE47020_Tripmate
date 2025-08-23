import React, { useState, useEffect } from "react";
import { fetchUserExpenses, addExpense, deleteExpense } from "../api/expenseApi";

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const data = await fetchUserExpenses(user._id);
        setExpenses(data);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setError("Please log in to add expenses");
        return;
      }

      const expenseData = {
        userId: user._id,
        title: form.title,
        amount: parseFloat(form.amount),
        category: "General"
      };

      await addExpense(expenseData);
      setForm({ title: "", amount: "" });
      await fetchExpenses();
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      await fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense");
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Expense Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="e.g. Hotel, Food, Transport"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (৳)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            placeholder="e.g. 1500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {expenses.map((exp) => (
              <li key={exp._id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">{exp.title}</span>
                  {exp.category && <span className="text-sm text-gray-500 ml-2">({exp.category})</span>}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-700 font-medium">৳ {exp.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-right text-lg font-bold text-purple-800">
        Total: ৳ {total.toFixed(2)}
      </div>
    </div>
  );
}