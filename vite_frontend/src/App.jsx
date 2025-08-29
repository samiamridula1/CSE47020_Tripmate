import { useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./components/common/Layout";
import Login from "./components/Login";
import MyTrips from "./components/MyTrips";
import Profile from "./components/Profile";
import TransportBooking from "./components/TransportBooking";
import { NotificationContainer } from "./components/Notification";

import Register from "./pages/Register";
import Budget from "./pages/Budget";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import HotelBooking from "./pages/HotelBooking";
import TripSuggestionsPage from "./pages/TripSuggestionsPage";
import AllExperiences from "./pages/AllExperiences";
import MyExperiences from "./pages/MyExperiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import People from "./pages/People";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      const parsedUser = JSON.parse(storedUser);
      // Check for either isAuthenticated flag or if user has _id (logged in)
      return parsedUser?.isAuthenticated || parsedUser?._id ? parsedUser : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />

        {user && (
          <>
            <Route
              path="/dashboard"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <Dashboard user={user} />
                </Layout>
              }
            />
            <Route
              path="/my-trips"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <MyTrips user={user} />
                </Layout>
              }
            />
            <Route
              path="/trips"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <MyTrips user={user} />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <Profile user={user} />
                </Layout>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <EditProfile user={user} />
                </Layout>
              }
            />
            <Route
              path="/budget"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <Budget />
                </Layout>
              }
            />
            <Route
              path="/hotel-booking"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <HotelBooking user={user} />
                </Layout>
              }
            />
            <Route
              path="/transport-booking"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <TransportBooking user={user} />
                </Layout>
              }
            />
            <Route
              path="/trip-suggestions"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <TripSuggestionsPage />
                </Layout>
              }
            />
            <Route
              path="/all-experiences"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <AllExperiences />
                </Layout>
              }
            />
            <Route
              path="/my-experiences"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <MyExperiences />
                </Layout>
              }
            />
            <Route
              path="/people"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <People />
                </Layout>
              }
            />
            <Route
              path="/experience/:id"
              element={
                <Layout userName={user.name} onLogout={handleLogout}>
                  <ExperienceDetail />
                </Layout>
              }
            />
          </>
        )}

        {!user && <Route path="*" element={<Navigate to="/login" />} />}
      </>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <NotificationContainer />
    </>
  );
}

export default App;