import React from "react";
import BudgetTracker from "../components/BudgetTracker";

export default function Budget() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">💰 Budget Tracker</h1>
      <p className="text-gray-600">Track your trip expenses and stay on budget.</p>
      <BudgetTracker />
    </div>
  );
}