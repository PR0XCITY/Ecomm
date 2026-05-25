import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { orderService } from "../../services/orderService";
import type { OrderExtended } from "../../services/orderService";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminOrders: React.FC = () => {
  const { addToast } = useApp();
  const [ordersList, setOrdersList] = useState<OrderExtended[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Detailed Modal State
  const [selectedOrder, setSelectedOrder] = useState<OrderExtended | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Refund Dialog State
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrdersList(data);
    } catch {
      addToast("Failed to fetch order directories.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, status: OrderExtended["status"]) => {
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      addToast(`Order marked as ${status}.`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      setStatusDropdownOpen(false);
      await loadOrders();
    } catch {
      addToast("Failed to update status.", "error");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const updated = await orderService.updateOrderStatus(
        orderId,
        "Cancelled",
        "Fulfillment: Cancelled by administrative request"
      );
      addToast("Order cancelled.");
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      await loadOrders();
    } catch {
      addToast("Failed to cancel order.", "error");
    }
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    if (refundAmount <= 0 || refundAmount > selectedOrder.total) {
      addToast("Invalid refund amount.", "error");
      return;
    }
    if (!refundReason.trim()) {
      addToast("Refund reason is required.", "error");
      return;
    }

    try {
      const updated = await orderService.processRefund(selectedOrder.id, refundReason.trim(), refundAmount);
      addToast(`Refund of ₹${refundAmount.toLocaleString()} processed.`);
      setSelectedOrder(updated);
      setRefundOpen(false);
      setRefundReason("");
      await loadOrders();
    } catch (err: any) {
      addToast(err.message || "Failed to process refund.", "error");
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-secondary-container text-on-secondary-container";
      case "Pending":
        return "bg-primary-fixed text-on-primary-fixed-variant";
      case "Shipped":
        return "bg-[#e6f4ea] text-[#137333]";
      case "Delivered":
        return "bg-[#d2e3fc] text-[#1a73e8]";
      case "Cancelled":
        return "bg-error-container text-on-error-container";
      case "Refunded":
        return "bg-surface-container-highest text-on-surface-variant line-through";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const filtered = ordersList.filter((o) => {
    const q = search.toLowerCase();
    return o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Orders Fulfillment</h2>
          <p className="text-xs text-on-surface-variant mt-1">Manage processing, deliveries, cancellations, and refunds.</p>
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
            placeholder="Search orders by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-outline rounded-lg bg-surface-lowest text-xs w-full"
          />
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-semibold uppercase tracking-wider">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items count</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low/30">
                    <td className="p-4 font-semibold text-primary">
                      <span className="hover:underline cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        {order.id}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface">{order.customerName}</td>
                    <td className="p-4 text-on-surface-variant">
                      {order.items.reduce((acc, i) => acc + i.quantity, 0)} units
                    </td>
                    <td className="p-4 font-semibold text-on-surface">
                      {order.currency === "INR" ? `₹${order.total.toLocaleString()}` : `$${order.total.toFixed(2)}`}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant font-mono">{order.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="bg-surface border border-outline hover:bg-surface-container px-3 py-1 rounded font-semibold text-[10px] cursor-pointer"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-on-surface-variant">
                      No matching orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAIL DRAWER / VIEW MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-surface w-full max-w-xl h-screen overflow-y-auto p-8 shadow-2xl border-l border-outline-variant/30 flex flex-col justify-between text-xs">
            <div>
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4 mb-6">
                <div>
                  <h3 className="font-headline-sm text-lg text-primary">Order {selectedOrder.id} Detail View</h3>
                  <p className="text-[10px] text-on-surface-variant/80 font-mono mt-0.5">Placed on {selectedOrder.date}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 hover:bg-surface-container rounded-full text-on-surface border-none bg-transparent cursor-pointer"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-6 text-left">
                {/* Status and Action Buttons */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant block mb-1">Current State</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusClass(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div className="flex gap-2 relative">
                    <button
                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      className="bg-primary text-on-primary px-4 py-2 rounded font-bold hover:bg-primary-container text-[10px] cursor-pointer flex items-center gap-1 border-none"
                    >
                      Update Status
                      <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                    </button>
                    {statusDropdownOpen && (
                      <div className="absolute right-0 top-9 bg-surface border border-outline shadow-xl rounded-lg py-1.5 w-36 z-50 text-left">
                        {["Processing", "Pending", "Shipped", "Delivered"].map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(selectedOrder.id, st as any)}
                            className="w-full px-3 py-1.5 hover:bg-surface-container text-[10px] text-left cursor-pointer border-none bg-transparent"
                          >
                            Set {st}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedOrder.status !== "Cancelled" && selectedOrder.status !== "Refunded" && (
                      <>
                        <button
                          onClick={() => {
                            setRefundAmount(selectedOrder.total);
                            setRefundOpen(true);
                          }}
                          className="bg-surface-container-highest border border-outline hover:bg-surface-container text-on-surface px-3 py-2 rounded font-bold text-[10px] cursor-pointer"
                        >
                          Process Refund
                        </button>
                        <button
                          onClick={() => handleCancelOrder(selectedOrder.id)}
                          className="bg-error-container text-error hover:bg-error/15 px-3 py-2 rounded font-bold text-[10px] cursor-pointer border-none"
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-3">
                  <h4 className="font-bold text-primary uppercase tracking-wide">Ordered Items</h4>
                  <div className="divide-y divide-outline-variant/20 border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-lowest">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 items-center">
                        <div className="w-12 h-14 bg-surface-container rounded overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold text-primary">{item.title}</p>
                          <p className="text-[10px] text-on-surface-variant italic mt-0.5">Note: "{item.details}"</p>
                        </div>
                        <div className="text-right font-mono">
                          <p>{item.quantity} x ₹{item.price.toLocaleString()}</p>
                          <p className="font-bold text-secondary mt-0.5">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low">
                    <h5 className="font-bold text-primary mb-2 uppercase tracking-wide">Customer Detail</h5>
                    <p className="font-bold text-on-surface">{selectedOrder.customerName}</p>
                    <p className="text-on-surface-variant mt-1">Payment: {selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-outline-variant/20 bg-surface-container-low">
                    <h5 className="font-bold text-primary mb-2 uppercase tracking-wide">Address Delivery</h5>
                    <p className="text-on-surface-variant leading-relaxed">{selectedOrder.shippingAddress || "Saved Primary Address"}</p>
                  </div>
                </div>

                {/* Fulfillment Audit Trails logs */}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/25 space-y-2">
                  <h4 className="font-bold text-primary uppercase tracking-wide">Fulfillment Log History</h4>
                  <div className="divide-y divide-outline-variant/15 font-mono text-[9px] text-on-surface-variant max-h-36 overflow-y-auto">
                    {selectedOrder.fulfillmentLogs?.map((log, idx) => (
                      <div key={idx} className="py-1.5 flex justify-between gap-4">
                        <span>{log.action}</span>
                        <span className="shrink-0 opacity-70">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Refund detail section */}
                {selectedOrder.status === "Refunded" && selectedOrder.refundDetails && (
                  <div className="p-4 bg-error-container/10 border border-error/20 text-error rounded-xl">
                    <h5 className="font-bold text-error uppercase mb-1">Refund Information</h5>
                    <p className="font-bold font-mono">Refund Amount: ₹{selectedOrder.refundDetails.amount.toLocaleString()}</p>
                    <p className="mt-1">Reason: "{selectedOrder.refundDetails.reason}"</p>
                    <p className="text-[9px] mt-2 opacity-80">{selectedOrder.refundDetails.timestamp}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REFUND DIALOG POPUP MODAL */}
      {refundOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex justify-center items-center p-4">
          <div className="bg-surface w-full max-w-sm rounded-xl p-6 shadow-2xl border border-outline-variant/30 relative text-xs text-left">
            <button
              onClick={() => setRefundOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary p-2 cursor-pointer border-none bg-transparent"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-sm text-primary mb-4">Refund Transaction</h3>
            <form onSubmit={handleRefundSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Refund Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs font-mono"
                />
                <p className="text-[10px] text-on-surface-variant mt-1">Maximum refundable: ₹{selectedOrder?.total.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Reason for Refund</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Out of stock raw materials, print calibration errors..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 border border-outline rounded-lg bg-surface-lowest text-xs"
                />
              </div>
              <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRefundOpen(false)}
                  className="border border-outline px-4 py-2 rounded hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-5 py-2 rounded font-bold hover:bg-primary-container cursor-pointer border-none"
                >
                  Submit Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
