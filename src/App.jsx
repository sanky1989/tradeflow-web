import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/customers/Customers";
import CustomerDetails from "./pages/customers/CustomerDetails";
import CustomerEdit from "./pages/customers/CustomeUpdates";
import CustomerAddSite from "./pages/customers/CustomerAddSite";
import CustomerCreate from "./pages/customers/CustomerCreate";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/common/Loader";
import { Toaster } from "react-hot-toast";
import Products from "./pages/products/Products";
import ProductCreate from "./pages/products/ProductCreate";
import ProductEdit from "./pages/products/ProductEdit";
import ProductDetail from "./pages/products/ProductDetail";
import Inventory from "./pages/inventory/Inventory"; 
import Suppliers from "./pages/suppliers/Suppliers";
import SupplierCreate from "./pages/suppliers/SupplierCreate";
import SupplierDetails from "./pages/suppliers/SupplierDetails";
import SupplierEdit from "./pages/suppliers/SupplierEdit";
import Users from "./pages/users/Users";
import UserCreate from "./pages/users/UserCreate";
import UserDetails from "./pages/users/UserDetails";


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
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/:id/edit" element={<ProductEdit />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/suppliers/new" element={<SupplierCreate />} />
          <Route path="/suppliers/:id" element={<SupplierDetails />} />
          <Route path="/suppliers/:id/edit" element={<SupplierEdit />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/new" element={<UserCreate />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </BrowserRouter></>
  );
}

export default App;