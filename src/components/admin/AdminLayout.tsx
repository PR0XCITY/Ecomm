import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { hasPermission } from "../../services/userService";
import type { Permission } from "../../services/userService";
import { motion, AnimatePresence } from "framer-motion";

export const AdminLayout: React.FC = () => {
  const { adminUser, logoutAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Close menus on path changes
  useEffect(() => {
    setMobileSidebarOpen(false);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  if (!adminUser) return null;

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin/login");
  };

  // Dynamically map navigation options based on permissions
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "dashboard", permission: "analytics.view" as Permission },
    { path: "/admin/products", label: "Products Catalog", icon: "inventory_2", permission: "products.view" as Permission },
    { path: "/admin/categories", label: "Categories", icon: "category", permission: "products.view" as Permission },
    { path: "/admin/orders", label: "Orders Manager", icon: "receipt_long", permission: "orders.view" as Permission },
    { path: "/admin/customers", label: "Customers", icon: "group", permission: "customers.view" as Permission },
    { path: "/admin/inventory", label: "Inventory Tracker", icon: "warehouse", permission: "inventory.view" as Permission },
    { path: "/admin/coupons", label: "Coupons", icon: "local_offer", permission: "analytics.view" as Permission },
    { path: "/admin/reviews", label: "Reviews Moderator", icon: "rate_review", permission: "reviews.moderate" as Permission },
    { path: "/admin/media", label: "Media Library", icon: "image", permission: "products.view" as Permission },
    { path: "/admin/analytics", label: "Advanced Analytics", icon: "insights", permission: "analytics.view" as Permission },
    { path: "/admin/settings", label: "Store Settings", icon: "settings", permission: "settings.manage" as Permission },
    { path: "/admin/users", label: "Staff Accounts", icon: "manage_accounts", permission: "users.manage" as Permission },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.permission || hasPermission(adminUser.role, item.permission)
  );

  // Mock Notification logs
  const notifications = [
    { id: 1, title: "Low Stock Alert", text: "Marigold Heirloom Deck is below 10 items.", time: "10m ago", icon: "warning", color: "text-error" },
    { id: 2, title: "New Order", text: "Received Order #SS-9827361.", time: "1h ago", icon: "shopping_bag", color: "text-secondary" },
    { id: 3, title: "Pending Review", text: "Aditi G. submitted a review on badges.", time: "3h ago", icon: "rate_review", color: "text-primary" },
    { id: 4, title: "Coupon Expiration", text: "DIWALI50 coupon expires in 2 days.", time: "5h ago", icon: "event_busy", color: "text-on-surface-variant" },
  ];

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const segments = location.pathname.split("/").filter((s) => s);
    return segments.map((seg, idx) => {
      const path = `/${segments.slice(0, idx + 1).join("/")}`;
      const isLast = idx === segments.length - 1;
      const label = seg.charAt(0).toUpperCase() + seg.slice(1);
      return (
        <span key={path} className="flex items-center text-[11px] font-semibold text-on-surface-variant gap-1">
          {idx > 0 && <span className="material-symbols-outlined text-[12px] opacity-45">chevron_right</span>}
          {isLast ? (
            <span className="text-primary font-bold">{label}</span>
          ) : (
            <Link to={path} className="hover:text-primary transition-colors">{label}</Link>
          )}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-surface flex text-left font-body-md text-sm text-on-surface">
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container border-r border-outline-variant/30 sticky h-screen top-0 select-none shrink-0 p-4 gap-1.5 z-40">
        <div className="px-3 py-4 mb-6">
          <Link to="/" className="font-display-lg text-primary text-xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">workspace_premium</span>
            Shuffling Smiles
          </Link>
          <span className="text-[10px] text-on-surface-variant/80 font-bold uppercase tracking-wider block mt-1">
            Admin Console
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1 scrollbar-thin">
          {visibleMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-semibold text-xs ${
                  isActive
                    ? "bg-primary text-on-primary font-bold shadow"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-outline-variant/30 mt-auto flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            Return to Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-error/10 hover:text-error rounded-lg text-left cursor-pointer border-none bg-transparent"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header navbar */}
        <header className="h-16 border-b border-outline-variant/30 bg-surface/85 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-container rounded-lg text-on-surface border-none bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Breadcrumb guiding routes */}
            <div className="hidden sm:flex items-center gap-1">
              {getBreadcrumbs()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification center icon */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-surface-container rounded-full text-on-surface relative border-none bg-transparent cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant shadow-xl rounded-xl z-50 overflow-hidden text-xs"
                    >
                      <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex justify-between items-center">
                        <span className="font-bold text-primary">Alert Notifications</span>
                        <span className="bg-error/15 text-error px-2 py-0.5 rounded text-[10px] font-bold">4 Actions</span>
                      </div>
                      <div className="divide-y divide-outline-variant/20 max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-4 flex gap-3 hover:bg-surface-container/30 transition-colors">
                            <span className={`material-symbols-outlined shrink-0 ${notif.color}`}>{notif.icon}</span>
                            <div>
                              <p className="font-bold text-on-surface">{notif.title}</p>
                              <p className="text-[11px] text-on-surface-variant mt-0.5">{notif.text}</p>
                              <p className="text-[9px] text-on-surface-variant/75 mt-1 font-mono">{notif.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 p-1 px-2.5 hover:bg-surface-container rounded-full text-on-surface border-none bg-transparent cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-outline bg-surface shrink-0">
                  <img src={adminUser.avatar} alt={adminUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-bold text-xs truncate max-w-[120px]">{adminUser.name}</p>
                  <p className="text-[10px] text-on-surface-variant truncate uppercase font-bold tracking-wider">{adminUser.role}</p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant shadow-xl rounded-xl z-50 py-1.5 text-xs"
                    >
                      <div className="px-4 py-2 border-b border-outline-variant/20 mb-1">
                        <p className="font-bold truncate">{adminUser.name}</p>
                        <p className="text-[10px] text-on-surface-variant truncate">{adminUser.email}</p>
                      </div>
                      <Link to="/admin/settings" className="flex items-center gap-2.5 px-4 py-2 hover:bg-surface-container text-on-surface">
                        <span className="material-symbols-outlined text-[16px]">settings</span>
                        <span>Preferences</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-error/10 hover:text-error text-on-surface text-left cursor-pointer border-none bg-transparent"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Child Route Content */}
        <main className="flex-grow p-6 md:p-8 max-w-container-max mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            {/* Side Navigation Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-64 bg-surface-container border-r border-outline-variant/30 h-full p-4 flex flex-col gap-1.5 z-50 select-none text-xs"
            >
              <div className="flex justify-between items-center mb-6 px-3 pt-2">
                <span className="font-display-lg text-primary text-lg font-bold">Admin Panel</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 hover:bg-surface-container rounded-full text-on-surface border-none bg-transparent cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {visibleMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-semibold text-xs ${
                        isActive
                          ? "bg-primary text-on-primary font-bold shadow"
                          : "text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-outline-variant/30 mt-auto flex flex-col gap-1">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high rounded-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">storefront</span>
                  <span>Storefront</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-error/10 hover:text-error rounded-lg text-left cursor-pointer border-none bg-transparent"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
