import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { userService } from "../../services/userService";
import type { AdminUser, AdminRole } from "../../services/userService";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminUsers: React.FC = () => {
  const { addToast, adminUser, reloadAdminUsers } = useApp();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("Staff");
  const [avatar, setAvatar] = useState("");

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAdminUsers();
      setUsers(data);
    } catch {
      addToast("Failed to fetch administrative staff list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      const avatarUrl = avatar.trim() || "https://lh3.googleusercontent.com/aida-public/AB6AXuChrvCd3NVnawkxmS-buKLboBGQxc6jxZgFiWjpAIoeWenIyFfTQwJlRpoRt0Ts1bLp3Wc5LlVIsNG1IoI-9tDDW_md4Rxc9W1dnvOc5geiElB7AeJbgZqpe292UvicPs8f361Bon0j3ZcA8UlbSyhq7de_3knGP4wlkPMdDLbX-yB5iXZeBH0n4vUuQWflvUugSZKYbi3SzyeBxQhDT49hh8Ndf0ir4ZBn1NuY1k8Ym54OtdFFuuMfxv8h2zqbeSHTFAbDSDKO";
      await userService.createAdminUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        avatar: avatarUrl
      });
      addToast("Staff account created successfully.");
      setShowAddModal(false);
      resetForm();
      // Reload lists
      await loadUsers();
      await reloadAdminUsers();
    } catch (err: any) {
      addToast(err.message || "Failed to create staff account.", "error");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!name.trim() || !email.trim()) {
      addToast("Please fill in all required fields.", "error");
      return;
    }

    try {
      const avatarUrl = avatar.trim() || selectedUser.avatar;
      await userService.updateAdminUser(selectedUser.id, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        avatar: avatarUrl
      });
      addToast("Staff account updated successfully.");
      setShowEditModal(false);
      setSelectedUser(null);
      resetForm();
      // Reload lists
      await loadUsers();
      await reloadAdminUsers();
    } catch (err: any) {
      addToast(err.message || "Failed to update staff account.", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === adminUser?.id) {
      addToast("You cannot delete your own active account.", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to terminate this staff account?")) {
      return;
    }

    try {
      await userService.deleteAdminUser(userId);
      addToast("Staff account deleted successfully.");
      await loadUsers();
      await reloadAdminUsers();
    } catch {
      addToast("Failed to delete staff account.", "error");
    }
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setAvatar(user.avatar);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("Staff");
    setAvatar("");
  };

  const getRoleBadgeColor = (r: AdminRole) => {
    switch (r) {
      case "Super Admin":
        return "bg-primary text-on-primary";
      case "Admin":
        return "bg-secondary text-on-secondary";
      case "Manager":
        return "bg-[#df9f28] text-black";
      case "Staff":
        return "bg-surface-container-high text-on-surface-variant";
      default:
        return "bg-surface text-on-surface";
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Staff Accounts</h2>
          <p className="text-xs text-on-surface-variant mt-1">Manage administrative login credentials and Role-Based Access (RBAC) permissions.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 hover:bg-primary/95 transition-all shadow cursor-pointer border-none"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Staff Account
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search staff members by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-outline rounded-lg bg-surface-lowest text-xs w-full focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Users Registry Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-semibold uppercase tracking-wider">
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Account ID</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/30">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-outline bg-surface shrink-0">
                        <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-primary">{u.name} {u.id === adminUser?.id && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded font-bold uppercase">(You)</span>}</span>
                    </td>
                    <td className="p-4 font-mono text-on-surface-variant">{u.email}</td>
                    <td className="p-4 font-mono text-on-surface-variant/80">{u.id}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="bg-surface border border-outline hover:bg-surface-container text-on-surface px-3 py-1 rounded font-semibold text-[10px] cursor-pointer"
                      >
                        Edit Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === adminUser?.id}
                        className="bg-error/10 hover:bg-error/20 text-error disabled:opacity-50 px-3 py-1 rounded font-semibold text-[10px] cursor-pointer border-none"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                      No matching staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE STAFF MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface w-full max-w-md rounded-xl p-6 shadow-2xl border border-outline-variant/30 relative text-xs text-left">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-sm text-lg text-primary mb-6">Create New Staff Profile</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Gupta"
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditi@shufflingsmiles.com"
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Leave empty for default profile image"
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Access Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Staff">Staff (Fulfillment &amp; Reviews)</option>
                  <option value="Manager">Manager (Edit Products &amp; Storefront)</option>
                  <option value="Admin">Admin (Full Control, no User Manage)</option>
                  <option value="Super Admin">Super Admin (All permissions)</option>
                </select>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/15 text-[10px] text-on-surface-variant">
                <span className="font-bold text-primary block mb-1">Standard Mock Password Rules:</span>
                - Super Admin password: <code className="font-mono bg-surface px-1 py-0.5 rounded text-secondary font-bold">admin123</code><br/>
                - Manager password: <code className="font-mono bg-surface px-1 py-0.5 rounded text-secondary font-bold">manager123</code><br/>
                - Staff password: <code className="font-mono bg-surface px-1 py-0.5 rounded text-secondary font-bold">staff123</code>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="border border-outline hover:bg-surface-container text-on-surface px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary hover:bg-primary/95 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface w-full max-w-md rounded-xl p-6 shadow-2xl border border-outline-variant/30 relative text-xs text-left">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-sm text-lg text-primary mb-6">Modify Staff Privileges</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface-variant mb-1 uppercase tracking-wider text-[9px]">Access Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs focus:outline-none"
                >
                  <option value="Staff">Staff (Fulfillment &amp; Reviews)</option>
                  <option value="Manager">Manager (Edit Products &amp; Storefront)</option>
                  <option value="Admin">Admin (Full Control, no User Manage)</option>
                  <option value="Super Admin">Super Admin (All permissions)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className="border border-outline hover:bg-surface-container text-on-surface px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary hover:bg-primary/95 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border-none"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
