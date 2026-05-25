import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalData, setLocalData } from "../services/db";
import { userService } from "../services/userService";
import type { AdminUser } from "../services/userService";
import { productService } from "../services/productService";
import type { ProductLifecycle } from "../services/productService";
import { orderService } from "../services/orderService";
import type { OrderExtended } from "../services/orderService";
import { couponService } from "../services/couponService";
import type { CouponExtended } from "../services/couponService";
import { reviewService } from "../services/reviewService";
import type { Product, Review, UserNotification, ActivityLog } from "../mock/mockData";

export type Page = "home" | "shop" | "product-detail" | "cart" | "order-confirmed" | "admin" | "checkout" | "account";

export interface CartItem {
  id: string; // unique item id (composite of product id + customization string)
  productId: string;
  title: string;
  quantity: number;
  customization: string;
  price: number; // Unit price
  currency: "INR" | "USD";
  image: string;
}

export interface SavedAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface SavedCard {
  id: string;
  cardholder: string;
  number: string;
  expiry: string;
  cvv: string;
  brand: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  addresses: SavedAddress[];
  paymentMethods: SavedCard[];
  notifications: UserNotification[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  activePage: Page;
  detailedProductId: string;
  confirmedOrderId: string;
  cart: CartItem[];
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  orders: OrderExtended[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Auth state
  user: UserProfile;
  updateUser: (updatedUser: UserProfile) => void;
  adminUser: AdminUser | null;
  loginAdmin: (email: string, password: string) => Promise<AdminUser>;
  logoutAdmin: () => Promise<void>;
  reloadAdminUsers: () => Promise<AdminUser[]>;
  adminUsersList: AdminUser[];
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  // Products Catalog
  catalog: ProductLifecycle[];
  reloadCatalog: () => Promise<void>;
  
  // Reviews
  reviews: Review[];
  reloadReviews: () => Promise<void>;
  addReview: (productId: string, author: string, rating: number, comment: string) => Promise<Review>;
  
  // Coupons
  coupons: CouponExtended[];
  reloadCoupons: () => Promise<void>;
  
  // Settings & Banner
  banners: string;
  updateBanner: (msg: string) => void;
  settings: any;
  updateSettings: (newSettings: any) => Promise<void>;
  
  // Logs
  logs: ActivityLog[];
  reloadLogs: () => Promise<void>;
  addLog: (action: string) => void;
  
  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (toastId: string) => void;
  
  // Utilities
  recentlyViewed: string[];
  addViewedProduct: (productId: string) => void;
  addToCart: (product: Product, quantity: number, customization: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, paymentMethod: string, itemsList?: CartItem[], summaryTotal?: number) => Promise<string>;
  navigateTo: (page: Page, extraId?: string) => void;
  cartTotal: number;
  cartCurrency: "INR" | "USD";
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<Page>("home");
  const [detailedProductId, setDetailedProductId] = useState<string>("wedding-invitation-suite");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  // 1. Initial State Seeded synchronously from Local Storage keys
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    return userService.getAdminSession();
  });

  const [adminUsersList, setAdminUsersList] = useState<AdminUser[]>([]);

  const [catalog, setCatalog] = useState<ProductLifecycle[]>(() => {
    return getLocalData<ProductLifecycle[]>("ss_products", []);
  });

  const [orders, setOrders] = useState<OrderExtended[]>(() => {
    return getLocalData<OrderExtended[]>("ss_orders", []);
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    return getLocalData<Review[]>("ss_reviews", []);
  });

  const [coupons, setCoupons] = useState<CouponExtended[]>(() => {
    return getLocalData<CouponExtended[]>("ss_coupons", []);
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    return getLocalData<ActivityLog[]>("ss_audit_logs", []);
  });

  const [settings, setSettings] = useState<any>(() => {
    return getLocalData<any>("ss_settings", {});
  });

  const [banners, setBanners] = useState(() => {
    return getLocalData<string>("ss_homepage_banner", "Celebrating Heritage with Gold Foil: Free shipping on orders over ₹5,000!");
  });

  // User Customer Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ss_customer_session");
    if (saved) return JSON.parse(saved);
    return {
      name: "Aanya Sharma",
      email: "aanya.sharma@example.com",
      phone: "+91 98765 43210",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
      memberSince: "Oct 2024",
      addresses: [
        {
          id: "addr-1",
          name: "Primary Residence",
          street: "12, Kasturba Gandhi Marg",
          city: "New Delhi",
          state: "Delhi",
          zip: "110001",
          country: "India",
          isDefault: true,
        },
      ],
      paymentMethods: [
        {
          id: "card-1",
          cardholder: "Aanya Sharma",
          number: "•••• •••• •••• 4242",
          expiry: "12/28",
          cvv: "•••",
          brand: "Visa",
        },
      ],
      notifications: [],
    };
  });

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("ss_customer_session", JSON.stringify(updatedUser));
  };

  // Sync methods to pull updated lists from storage
  const reloadCatalog = async () => {
    const list = await productService.getProducts(true);
    setCatalog(list);
  };

  const reloadReviews = async () => {
    const list = await reviewService.getReviews(true);
    setReviews(list);
  };

  const reloadCoupons = async () => {
    const list = await couponService.getCoupons();
    setCoupons(list);
  };

  const reloadLogs = async () => {
    const auditLogs = getLocalData<ActivityLog[]>("ss_audit_logs", []);
    setLogs(auditLogs);
  };

  const reloadAdminUsers = async () => {
    const list = await userService.getAdminUsers();
    setAdminUsersList(list);
    return list;
  };

  // Load database arrays on mount
  useEffect(() => {
    reloadCatalog();
    reloadReviews();
    reloadCoupons();
    reloadLogs();
    if (adminUser) {
      reloadAdminUsers();
    }
  }, [adminUser]);

  const addReview = async (productId: string, author: string, rating: number, comment: string) => {
    const newReview = await reviewService.addReview(productId, author, rating, comment);
    await reloadReviews();
    addToast("Review submitted successfully! It is now pending moderation.", "success");
    return newReview;
  };

  const addLog = (action: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      action,
      user: adminUser?.name || user.name || "Guest",
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }),
    };
    setLogs((prev) => {
      const updated = [newLog, ...prev];
      setLocalData("ss_audit_logs", updated);
      return updated;
    });
  };

  // Auth Operations
  const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
    const userObj = await userService.loginAdmin(email, password);
    setAdminUser(userObj);
    return userObj;
  };

  const logoutAdmin = async (): Promise<void> => {
    await userService.logoutAdmin();
    setAdminUser(null);
  };

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isWish = prev.includes(productId);
      const next = isWish ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(next));
      addToast(
        isWish ? "Removed from Wishlist" : "Added to Wishlist",
        isWish ? "info" : "success"
      );
      return next;
    });
  };

  // Banner State
  const updateBanner = (msg: string) => {
    setBanners(msg);
    setLocalData("ss_homepage_banner", msg);
    addToast("Banner message updated!");
  };

  // Settings
  const updateSettings = async (newSettings: any) => {
    setSettings(newSettings);
    setLocalData("ss_settings", newSettings);
  };

  // Recently Viewed State
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const addViewedProduct = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 4); // Keep last 4 items
    });
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const navigateTo = (page: Page, extraId?: string) => {
    setActivePage(page);
    if (page === "shop") {
      if (extraId && extraId.startsWith("search:")) {
        setSearchQuery(extraId.substring(7));
        setSelectedCategory("");
      } else if (extraId) {
        setSelectedCategory(extraId);
        setSearchQuery("");
      } else {
        setSelectedCategory("");
        setSearchQuery("");
      }
      navigate("/shop");
    } else if (page === "product-detail" && extraId) {
      setDetailedProductId(extraId);
      addViewedProduct(extraId);
      navigate(`/product/${extraId}`);
    } else if (page === "order-confirmed" && extraId) {
      setConfirmedOrderId(extraId);
      navigate("/order-confirmed");
    } else if (page === "account") {
      if (extraId === "wishlist") {
        navigate("/wishlist");
      } else if (extraId === "orders") {
        navigate("/orders");
      } else {
        navigate("/account");
      }
    } else if (page === "admin") {
      navigate("/admin/dashboard");
    } else if (page === "home") {
      navigate("/");
    } else {
      navigate(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product, quantity: number, customization: string) => {
    const cartItemId = `${product.id}-${encodeURIComponent(customization)}`;

    let itemPrice = product.price;
    let itemCurrency = product.currency;

    if (product.id === "wedding-invitation-suite") {
      itemPrice = 42500;
      itemCurrency = "INR";
    } else if (product.id === "custom-gold-foil-cards") {
      itemPrice = 15000;
      itemCurrency = "INR";
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        addToast(`Updated bag quantity for "${product.title}"`);
        return updated;
      }
      addToast(`Added "${product.title}" to your bag`);
      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          title: product.title,
          quantity,
          customization,
          price: itemPrice,
          currency: itemCurrency,
          image: product.image,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    if (item) addToast(`Removed "${item.title}" from bag`, "info");
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (
    customerName: string,
    paymentMethod: string,
    itemsList?: CartItem[],
    summaryTotal?: number
  ): Promise<string> => {
    const activeCart = itemsList || cart;
    const finalTotal = summaryTotal || cartTotal;

    if (activeCart.length === 0) return "";

    const orderItems = activeCart.map((item) => ({
      id: item.productId,
      title: item.title,
      quantity: item.quantity,
      details: item.customization,
      price: item.price,
      image: item.image,
    }));

    const currency = cartCurrency;
    const totalFormatted = currency === "INR" ? `₹${finalTotal.toLocaleString()}` : `$${finalTotal.toFixed(2)}`;

    // Call service to write to database asynchronously
    const createdOrder = await orderService.placeOrder({
      customerName,
      items: orderItems,
      total: finalTotal,
      currency,
      totalFormatted,
      status: "Pending",
      paymentMethod,
    });

    // Re-fetch orders list and update state
    const orderList = await orderService.getOrders();
    setOrders(orderList);
    clearCart();

    // Trigger confirmation screen redirect
    addToast("Order submitted successfully!");
    setConfirmedOrderId(createdOrder.id);
    navigateTo("order-confirmed", createdOrder.id);
    return createdOrder.id;
  };

  const cartCurrency = cart.length > 0 ? cart[0].currency : "INR";
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        activePage,
        detailedProductId,
        confirmedOrderId,
        cart,
        cartDrawerOpen,
        setCartDrawerOpen,
        orders,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        
        user,
        updateUser,
        adminUser,
        loginAdmin,
        logoutAdmin,
        reloadAdminUsers,
        adminUsersList,

        wishlist,
        toggleWishlist,
        catalog,
        reloadCatalog,
        reviews,
        reloadReviews,
        addReview,
        coupons,
        reloadCoupons,
        banners,
        updateBanner,
        settings,
        updateSettings,
        logs,
        reloadLogs,
        addLog,
        toasts,
        addToast,
        removeToast,
        recentlyViewed,
        addViewedProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        navigateTo,
        cartTotal,
        cartCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
export default AppContext;
