// src/components/ErrorPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Oops! Page not found.</p>
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline font-medium"
      >
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default ErrorPage;