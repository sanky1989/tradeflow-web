import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Customers from "../pages/customers/Customers";
import Products from "../pages/products/Products";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProductComponentsPage from "../pages/products/ProductComponentsPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/components"
          element={
            <ProtectedRoute>
              <ProductComponentsPage />
            </ProtectedRoute>
          }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;