// src/routes/AppRouter.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* You can add more private pages here */}
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
