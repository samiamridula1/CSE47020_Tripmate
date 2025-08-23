import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./../pages/Dashboard";
import Settings from "../components/Settings";
import ErrorPage from "./ErrorPage";
import MyTrips from "./components/MyTrips";
import Layout from "../components/common/Layout"; // adjust path if needed

export default function AuthenticatedApp({ user, handleLogout }) {
  console.log("✅ AuthenticatedApp loaded");

  return (
    <Layout userName={user?.email} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-trips" element={<MyTrips user={user} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Layout>
  );
}