import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountDashboardPage from './pages/AccountDashboardPage';
import OrderConfirmedPage from './pages/OrderConfirmedPage';
import ToastNotification from './components/ToastNotification';

// Admin Components & Layouts
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminUsers } from './pages/admin/AdminUsers';

// Storefront Wrapper Layout
const StorefrontLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />
      <main className="flex-grow overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <Routes>
        {/* 1. Storefront Application Routes */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<AccountDashboardPage />} />
          <Route path="/account" element={<AccountDashboardPage />} />
          <Route path="/orders" element={<AccountDashboardPage />} />
          <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
        </Route>

        {/* 2. Administrative Login Portal */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 3. Protected Nested Administration Workspace Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect to administrative overview */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          
          <Route
            path="dashboard"
            element={
              <ProtectedRoute permission="analytics.view">
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="products"
            element={
              <ProtectedRoute permission="products.view">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="categories"
            element={
              <ProtectedRoute permission="products.view">
                <AdminCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute permission="orders.view">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="customers"
            element={
              <ProtectedRoute permission="customers.view">
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute permission="inventory.view">
                <AdminInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="coupons"
            element={
              <ProtectedRoute permission="analytics.view">
                <AdminCoupons />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute permission="reviews.moderate">
                <AdminReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="media"
            element={
              <ProtectedRoute permission="products.view">
                <AdminMedia />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute permission="analytics.view">
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute permission="settings.manage">
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute permission="users.manage">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 4. Global Fallback Route (Redirects back to storefront home) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Universal Toast Overlay */}
      <ToastNotification />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
