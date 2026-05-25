import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { customerService } from "../../services/customerService";
import type { CustomerProfile } from "../../services/customerService";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminCustomers: React.FC = () => {
  const { addToast } = useApp();
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCust, setSelectedCust] = useState<CustomerProfile | null>(null);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch {
      addToast("Failed to fetch customer registry.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleStatusChange = async (userId: string, status: CustomerProfile["status"]) => {
    try {
      // In this prototype, we'll update the mock state locally and save to localStorage
      const updated = customers.map((c) => (c.id === userId ? { ...c, status } : c));
      setCustomers(updated);
      localStorage.setItem("ss_customers", JSON.stringify(updated));
      addToast(`Customer status marked as ${status}.`);
      if (selectedCust && selectedCust.id === userId) {
        setSelectedCust({ ...selectedCust, status });
      }
    } catch {
      addToast("Failed to change customer status.", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#e6f4ea] text-[#137333]";
      case "Inactive":
        return "bg-surface-container-high text-on-surface-variant";
      case "Blocked":
        return "bg-error-container text-on-error-container";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Customers Directory</h2>
          <p className="text-xs text-on-surface-variant mt-1">Track purchase histories, addresses, and customer profiles.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-outline rounded-lg bg-surface-lowest text-xs w-full"
          />
        </div>
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-semibold uppercase tracking-wider">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-center">Orders Count</th>
                  <th className="p-4 text-right">Total Spent</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-surface-container-low/30">
                    <td className="p-4 font-semibold text-primary">
                      <span className="hover:underline cursor-pointer" onClick={() => setSelectedCust(cust)}>
                        {cust.name}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant font-mono">{cust.email}</td>
                    <td className="p-4 text-center font-semibold text-on-surface">{cust.totalOrders}</td>
                    <td className="p-4 font-semibold text-secondary text-right">₹{cust.totalSpent.toLocaleString()}</td>
                    <td className="p-4 text-on-surface-variant">{cust.joinedDate}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(cust.status)}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCust(cust)}
                        className="bg-surface border border-outline hover:bg-surface-container px-3 py-1 rounded font-semibold text-[10px] cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No matching customer accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMER PROFILE DETAIL MODAL */}
      {selectedCust && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-xl p-8 shadow-2xl border border-outline-variant/30 relative text-xs text-left">
            <button
              onClick={() => setSelectedCust(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-3 border-b border-outline-variant/20 pb-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-outline bg-surface shrink-0">
                <img src={selectedCust.avatar} alt={selectedCust.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-headline-sm text-lg text-primary">{selectedCust.name}</h3>
                <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">Joined {selectedCust.joinedDate}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Account Stats */}
              <div className="grid grid-cols-3 gap-4 text-center font-mono">
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/15">
                  <p className="text-[9px] uppercase font-bold text-on-surface-variant">Total orders</p>
                  <p className="font-bold text-primary text-base mt-1">{selectedCust.totalOrders}</p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/15 col-span-2">
                  <p className="text-[9px] uppercase font-bold text-on-surface-variant">Total Spent (INR)</p>
                  <p className="font-bold text-secondary text-base mt-1">₹{selectedCust.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Status adjusters */}
              <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                <span className="font-bold text-primary uppercase tracking-wide">Account Status</span>
                <div className="flex gap-2">
                  {["Active", "Inactive", "Blocked"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedCust.id, status as any)}
                      className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors border-none ${
                        selectedCust.status === status
                          ? status === "Active"
                            ? "bg-[#e6f4ea] text-[#137333] border border-[#137333]/30"
                            : status === "Blocked"
                            ? "bg-error-container text-error border border-error/30"
                            : "bg-surface-container-high text-on-surface-variant border border-outline-variant"
                          : "bg-surface text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-2">
                <h4 className="font-bold text-primary uppercase tracking-wide text-xs">Billing &amp; Shipping Books</h4>
                <div className="p-4 rounded-xl border border-outline-variant/20 bg-surface-lowest text-xs text-on-surface-variant">
                  {selectedCust.addresses.length > 0 ? (
                    selectedCust.addresses.map((addr) => (
                      <div key={addr.id}>
                        <p className="font-bold text-on-surface">{addr.id === "addr-1" ? "Primary Location" : "Office Location"}</p>
                        <p className="mt-1">{addr.street}</p>
                        <p>{addr.city}, {addr.state} - {addr.zip}</p>
                        <p className="font-bold text-on-surface mt-1">{addr.country}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center italic py-2">No saved address cards found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
