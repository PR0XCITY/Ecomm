import { getLocalData, setLocalData, delay } from "./db";
import type { OrderExtended } from "./orderService";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: "Active" | "Inactive" | "Blocked";
  addresses: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }[];
}

// Initial customer list helper
const initialCustomers: CustomerProfile[] = [
  {
    id: "cust-1",
    name: "Aanya Sharma",
    email: "aanya.sharma@example.com",
    phone: "+91 98765 43210",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    totalOrders: 2,
    totalSpent: 73000,
    joinedDate: "Oct 2024",
    status: "Active",
    addresses: [
      {
        id: "addr-1",
        street: "12, Kasturba Gandhi Marg",
        city: "New Delhi",
        state: "Delhi",
        zip: "110001",
        country: "India",
      }
    ]
  },
  {
    id: "cust-2",
    name: "Rohan Patel",
    email: "rohan.patel@example.com",
    phone: "+91 98234 56789",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    totalOrders: 1,
    totalSpent: 12000,
    joinedDate: "Oct 2024",
    status: "Active",
    addresses: []
  },
  {
    id: "cust-3",
    name: "Priya Desai",
    email: "priya.desai@example.com",
    phone: "+91 98888 11111",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
    totalOrders: 1,
    totalSpent: 85000,
    joinedDate: "Oct 2024",
    status: "Active",
    addresses: []
  }
];

export const customerService = {
  getCustomers: async (): Promise<CustomerProfile[]> => {
    await delay(300);
    return getLocalData<CustomerProfile[]>("ss_customers", initialCustomers);
  },

  getCustomerById: async (id: string): Promise<CustomerProfile | null> => {
    await delay(200);
    const list = getLocalData<CustomerProfile[]>("ss_customers", initialCustomers);
    return list.find((c) => c.id === id) || null;
  },

  syncFromNewOrder: async (order: OrderExtended): Promise<void> => {
    const list = getLocalData<CustomerProfile[]>("ss_customers", initialCustomers);
    const emailMatch = `${order.customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`;

    const idx = list.findIndex((c) => c.name.toLowerCase() === order.customerName.toLowerCase());

    if (idx > -1) {
      list[idx].totalOrders += 1;
      list[idx].totalSpent += order.total;
    } else {
      const newCust: CustomerProfile = {
        id: `cust-${Date.now()}`,
        name: order.customerName,
        email: emailMatch,
        phone: "+91 99999 88888",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO",
        totalOrders: 1,
        totalSpent: order.total,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        status: "Active",
        addresses: [],
      };
      list.push(newCust);
    }
    setLocalData("ss_customers", list);
  }
};
