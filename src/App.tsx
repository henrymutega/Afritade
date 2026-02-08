import { Toaster as Sonner, Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleRedirect } from "@/components/auth/RoleRedirect";
// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import Help from "./pages/Help";
import Sell from "./pages/Sell";
// Seller Dashboard Pages
import SellerDashboard from "./pages/dashboard/SellerDashboard";
import ProductsPage from "./pages/dashboard/ProductsPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import InquiriesPage from "./pages/dashboard/InquiriesPage";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminSuppliersPage from "./pages/admin/SuppliersPage";
import ActivityLogsPage from "./pages/admin/ActivityLogsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<Products />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/supplier/:id" element={<Suppliers />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/help" element={<Help />} />
            <Route path="/sell" element={<Sell />} />

            {/* Role Routes */}
            <Route path="/auth-redirect" element={<RoleRedirect />} />;

            {/* Seller/Manufacturer Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['supplier', 'manufacturer']}>
                <SellerDashboard />
              </ProtectedRoute>
            } > 
              <Route index element={<SellerDashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="inquiries" element={<InquiriesPage />} />
            </Route>;

            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
                <UsersPage />
                <AdminProductsPage />
                <AdminOrdersPage />
                <AdminSuppliersPage />
                <ActivityLogsPage />
              </ProtectedRoute>
            } />;

            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
