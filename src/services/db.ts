import {
  mockProducts,
  mockInitialOrders,
  mockInitialReviews,
  mockInitialCoupons,
  mockActivityLogs,
} from "../mock/mockData";

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getLocalData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }
  // If not in storage, seed and return defaultValue
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
};

export const setLocalData = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed default databases on module load
export const seedDatabase = () => {
  const existingProducts = getLocalData<any[]>("ss_products", []);
  const needsReSeed = existingProducts.length === 0 || existingProducts.some(p => !p.status || !p.variants);
  if (needsReSeed) {
    setLocalData("ss_products", mockProducts);
  } else {
    getLocalData("ss_products", mockProducts);
  }
  getLocalData("ss_orders", mockInitialOrders);
  getLocalData("ss_reviews", mockInitialReviews);
  getLocalData("ss_coupons", mockInitialCoupons);
  getLocalData("ss_audit_logs", mockActivityLogs);

  // Default Admin Settings
  getLocalData("ss_settings", {
    storeName: "Shuffling Smiles",
    currency: "INR",
    taxRateINR: 18, // 18% GST
    taxRateUSD: 8,  // 8% Sales Tax
    freeShippingThresholdINR: 5000,
    freeShippingThresholdUSD: 100,
    shippingStandardINR: 300,
    shippingStandardUSD: 10,
    shippingExpressINR: 600,
    shippingExpressUSD: 20,
    shippingOvernightINR: 1000,
    shippingOvernightUSD: 35,
    emailTemplates: {
      orderConfirmation: "Thank you for choosing Shuffling Smiles. We are preparing your order {orderId}...",
      shippingUpdate: "Good news! Your order {orderId} has been fanned out...",
    }
  });

  // Default Media Assets
  getLocalData("ss_media", [
    {
      id: "media-1",
      name: "wedding-invite.jpg",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx4_9aBVTmSw53V26dxzt4BnvNDcpMoH235RrDgOTlZYYkWITHFmjtB7xLO7rqRx3c29CTZFM3E2q98OEpHC0KtrFlOgo3FP5CGxoaYIA34WLRWNnYaRA4xa2osgbcsdY9-LEEdkekNokNQjNoVt4aQ0cXbQ1vUN73wfN34rTiMLA_t1EDfzNakv2liVwXjQohaPwhLZx2lgpVKpVH9yaYbkPCVXvKm5OaZTECZNgsmjN_U9MKyu_t9V87fVRyC2xQtd1DDRV-",
      folder: "stationery",
      size: "245 KB",
      dimensions: "1200x1500",
      createdAt: "May 20, 2026",
    },
    {
      id: "media-2",
      name: "gold-foil-cards.jpg",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm2ft6JhqPGH94byzSmBwoBrEncSQajELtSNlBXClBzAeX1b76e12e3DOhs-B6L8zGa9WFVew5OwNhuSRKrHjE_G1hCYYxgPPHuLJyYgbaEdjimOxlBmY1IWFicHYhvDbMQ2qRn2xcJZNRqEjK-NJApds5settB-fxVa8DHhI1qrdCD_1gmncv6uDLIcSi9FNUM5X95anHV0DwA_jcuUu1kR-1i8s722FYcC3aAzMfdwV_X6EZKgWxtJZXi-B4ekVDHf41iU6l",
      folder: "playing_cards",
      size: "189 KB",
      dimensions: "1000x1250",
      createdAt: "May 21, 2026",
    },
    {
      id: "media-3",
      name: "henna-badges.jpg",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
      folder: "accessories",
      size: "112 KB",
      dimensions: "800x1000",
      createdAt: "May 22, 2026",
    },
  ]);

  // Default Admin Users (Staff list)
  getLocalData("ss_admin_users", [
    {
      id: "staff-1",
      email: "admin@shufflingsmiles.com",
      name: "Super Administrator",
      role: "Super Admin",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    },
    {
      id: "staff-2",
      email: "manager@shufflingsmiles.com",
      name: "Production Manager",
      role: "Manager",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    },
    {
      id: "staff-3",
      email: "staff@shufflingsmiles.com",
      name: "Fulfillment Associate",
      role: "Staff",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    },
  ]);
};

// Start seeding
seedDatabase();
