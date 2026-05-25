import { getLocalData, setLocalData, delay } from "./db";

export type AdminRole = "Super Admin" | "Admin" | "Manager" | "Staff";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar: string;
}

export type Permission =
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  | "orders.view"
  | "orders.edit"
  | "orders.refund"
  | "inventory.view"
  | "inventory.edit"
  | "customers.view"
  | "reviews.moderate"
  | "analytics.view"
  | "settings.manage"
  | "users.manage";

// Permissions mapping table
export const rolePermissions: Record<AdminRole, Permission[]> = {
  "Super Admin": [
    "products.view", "products.create", "products.edit", "products.delete",
    "orders.view", "orders.edit", "orders.refund",
    "inventory.view", "inventory.edit",
    "customers.view",
    "reviews.moderate",
    "analytics.view",
    "settings.manage",
    "users.manage"
  ],
  "Admin": [
    "products.view", "products.create", "products.edit", "products.delete",
    "orders.view", "orders.edit", "orders.refund",
    "inventory.view", "inventory.edit",
    "customers.view",
    "reviews.moderate",
    "analytics.view",
    "settings.manage"
  ],
  "Manager": [
    "products.view", "products.create", "products.edit",
    "orders.view", "orders.edit",
    "inventory.view", "inventory.edit",
    "customers.view",
    "reviews.moderate",
    "analytics.view",
    "settings.manage"
  ],
  "Staff": [
    "products.view",
    "orders.view",
    "inventory.view",
    "customers.view",
    "reviews.moderate"
  ]
};

export const hasPermission = (role: AdminRole, permission: Permission): boolean => {
  return rolePermissions[role]?.includes(permission) || false;
};

export const userService = {
  loginAdmin: async (email: string, password: string): Promise<AdminUser> => {
    await delay(400);

    const users = getLocalData<AdminUser[]>("ss_admin_users", []);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      throw new Error("Invalid admin email credential.");
    }

    // Basic password checking matching prompt requirements
    const correctPassword =
      user.role === "Super Admin"
        ? "admin123"
        : user.role === "Manager"
        ? "manager123"
        : "staff123";

    if (password !== correctPassword) {
      throw new Error("Incorrect password provided.");
    }

    setLocalData("ss_admin_session", user);
    return user;
  },

  logoutAdmin: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem("ss_admin_session");
  },

  getAdminSession: (): AdminUser | null => {
    return getLocalData<AdminUser | null>("ss_admin_session", null);
  },

  getAdminUsers: async (): Promise<AdminUser[]> => {
    await delay(300);
    return getLocalData<AdminUser[]>("ss_admin_users", []);
  },

  createAdminUser: async (user: Omit<AdminUser, "id">): Promise<AdminUser> => {
    await delay(400);
    const users = getLocalData<AdminUser[]>("ss_admin_users", []);
    
    if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase().trim())) {
      throw new Error("A staff member with this email already exists.");
    }

    const newUser: AdminUser = {
      ...user,
      id: `staff-${Date.now()}`,
    };

    users.push(newUser);
    setLocalData("ss_admin_users", users);
    return newUser;
  },

  updateAdminUser: async (userId: string, updatedFields: Partial<AdminUser>): Promise<AdminUser> => {
    await delay(400);
    const users = getLocalData<AdminUser[]>("ss_admin_users", []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("Staff member not found.");

    const updatedUser = {
      ...users[idx],
      ...updatedFields,
    };

    users[idx] = updatedUser;
    setLocalData("ss_admin_users", users);
    return updatedUser;
  },

  deleteAdminUser: async (userId: string): Promise<void> => {
    await delay(400);
    const users = getLocalData<AdminUser[]>("ss_admin_users", []);
    const filtered = users.filter((u) => u.id !== userId);
    setLocalData("ss_admin_users", filtered);
  }
};
