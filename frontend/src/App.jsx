import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import MockPaymentGatewayPage from './pages/MockPaymentGatewayPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductEditPage from './pages/admin/ProductEditPage';
import CancelledOrdersPage from './pages/admin/CancelledOrdersPage';
import CategoryManagementPage from './pages/admin/CategoryManagementPage';

// Static Pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ProfilePage from './pages/ProfilePage';
import VendorDashboard from './pages/vendor/VendorDashboard';

// Admin Components
import DashboardOverview from './components/admin/DashboardOverview';
import UserManager from './components/admin/UserManager';
import VendorManager from './components/admin/VendorManager';
import VendorRequestManager from './components/admin/VendorRequestManager';
import DeliveryAgentManager from './components/admin/DeliveryAgentManager';
import ProductManager from './components/admin/ProductManager';
import OrderManager from './components/admin/OrderManager';
import ReportsView from './components/admin/ReportsView';
import SettingsView from './components/admin/SettingsView';
import SupportTicketManager from './components/admin/SupportTicketManager';
import AdminVendorReviews from './components/admin/AdminVendorReviews';
import UserSupportManager from './components/admin/UserSupportManager';
import TaxManagementPage from './pages/admin/TaxManagementPage';

// Vendor Components
import VendorOverview from './components/vendor/VendorOverview';
import VendorProductManager from './components/vendor/VendorProductManager';
import VendorOrderManager from './components/vendor/VendorOrderManager';
import VendorCancelledOrders from './components/vendor/VendorCancelledOrders';
import VendorProfile from './components/vendor/VendorProfile';
import VendorInventory from './components/vendor/VendorInventory';
import VendorNotifications from './components/vendor/VendorNotifications';
import VendorSales from './components/vendor/VendorSales';
import VendorReviews from './components/vendor/VendorReviews';
import VendorSupport from './components/vendor/VendorSupport';

// Delivery Components
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import DeliveryOverview from './components/delivery/DeliveryOverview';
import DeliveryAssignedOrders from './components/delivery/DeliveryAssignedOrders';
import DeliveryOrderDetails from './components/delivery/DeliveryOrderDetails';
import DeliveryHistory from './components/delivery/DeliveryHistory';
import DeliveryProfile from './components/delivery/DeliveryProfile';
import DeliveryOrderRequests from './components/delivery/DeliveryOrderRequests';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/mock-payment/:id" element={<MockPaymentGatewayPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Nested Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManager />} />
            <Route path="vendor-requests" element={<VendorRequestManager />} />
            <Route path="vendors" element={<VendorManager />} />
            <Route path="delivery-agents" element={<DeliveryAgentManager />} />
            <Route path="products" element={<ProductManager />} />
            <Route path="orders" element={<OrderManager />} />
            <Route path="reports" element={<ReportsView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="cancelled" element={<CancelledOrdersPage />} />
            <Route path="support" element={<SupportTicketManager />} />
            <Route path="vendor-reviews" element={<AdminVendorReviews />} />
            <Route path="customer-support" element={<UserSupportManager />} />
            <Route path="taxes" element={<TaxManagementPage />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />

          {/* Vendor Nested Routes */}
          <Route path="/vendor/dashboard" element={<VendorDashboard />}>
            <Route index element={<VendorOverview />} />
            <Route path="products" element={<VendorProductManager />} />
            <Route path="orders" element={<VendorOrderManager />} />
            <Route path="cancelled" element={<VendorCancelledOrders />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="inventory" element={<VendorInventory />} />
            <Route path="notifications" element={<VendorNotifications />} />
            <Route path="sales" element={<VendorSales />} />
            <Route path="reviews" element={<VendorReviews />} />
            <Route path="support" element={<VendorSupport />} />
          </Route>

          {/* Delivery Nested Routes */}
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />}>
            <Route index element={<DeliveryOverview />} />
            <Route path="requests" element={<DeliveryOrderRequests />} />
            <Route path="assigned" element={<DeliveryAssignedOrders />} />
            <Route path="order/:id" element={<DeliveryOrderDetails />} />
            <Route path="history" element={<DeliveryHistory />} />
            <Route path="profile" element={<DeliveryProfile />} />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;

