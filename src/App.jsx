import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import CustomerEdit from "./pages/customers/CustomeUpdates";
import CustomerAddSite from "./pages/customers/CustomerAddSite";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/common/Loader";
import { Toaster } from "react-hot-toast";
import CustomerCreate from "./pages/customers/CustomerCreate";
import Inventory from "./pages/inventory/Inventory";


//NEW: PublicRoute
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <>
    <Toaster 
    position="bottom-right"
    toastOptions={{
    duration: 3000,
  }}
     />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PublicRoute>
            <Login />
          </PublicRoute>} />
        <Route
          element={<ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/customers/:id/edit" element={<CustomerEdit />} />
          <Route path="/customers/new" element={<CustomerCreate />} />
          <Route path="/customers/:id/add-site" element={<CustomerAddSite />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter></>
  );
}

export default App;