import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Profile from "../pages/Profile/Profile";
import Error404 from "../pages/Error404/Error404";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />

    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      }
    />

    <Route path="*" element={<Error404 />} />
  </Routes>
);
