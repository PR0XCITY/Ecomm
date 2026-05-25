import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import type { StockAdjustmentLog } from "../../services/inventoryService";
import type { ProductLifecycle } from "../../services/productService";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminInventory: React.FC = () => {
  const { addToast } = useApp();
  const [inventoryList, setInventoryList] = useState<ProductLifecycle[]>([]);
  const [logs, setLogs] = useState<StockAdjustmentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Stock Adjuster State
  const [adjustProductId, setAdjustProductId] = useState<string | null>(null);
  const [adjustValue, setAdjustValue] = useState(10);
  const [adjustReason, setAdjustReason] = useState("");

  useEffect(() => {
    import("../../services/inventoryService").then((module) => {
      loadInventory(module.inventoryService);
    });
  }, []);

  const loadInventory = async (service: any) => {
    setIsLoading(true);
    try {
      const data = await service.getInventoryStatus();
      const logsData = await service.getAdjustmentLogs();
      setInventoryList(data);
      setLogs(logsData);
    } catch {
      addToast("Failed to fetch inventory tracking sheets.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProductId) return;
    if (adjustValue === 0) {
      addToast("Adjustment value cannot be zero.", "error");
      return;
    }
    if (!adjustReason.trim()) {
      addToast("Adjustment reason is required.", "error");
      return;
    }

    try {
      const module = await import("../../services/inventoryService");
      await module.inventoryService.adjustStock(
        adjustProductId,
        adjustValue,
        "Admin", // Mock user adjust
        adjustReason.trim()
      );
      addToast("Inventory stock updated successfully.");
      setAdjustProductId(null);
      setAdjustReason("");
      await loadInventory(module.inventoryService);
    } catch (err: any) {
      addToast(err.message || "Failed to adjust inventory.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Inventory Tracking</h2>
          <p className="text-xs text-on-surface-variant mt-1">Perform stock refills, adjustments, and review audit trails.</p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-xs">
          {/* Left: Inventory List Table (Col 2) */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/50 text-on-surface-variant font-semibold uppercase tracking-wider">
                    <th className="p-4">Product Name</th>
                    <th className="p-4 text-center">In Stock</th>
                    <th className="p-4">Lifecycle Status</th>
                    <th className="p-4 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-md text-xs">
                  {inventoryList.map((p) => {
                    const isLow = p.stock <= 20;
                    return (
                      <tr key={p.id} className="hover:bg-surface-container-low/30">
                        <td className="p-4 font-semibold text-primary">{p.title}</td>
                        <td className="p-4 text-center">
                          <span className={`font-bold px-2 py-0.5 rounded ${isLow ? "bg-error-container text-error" : "text-on-surface"}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-on-surface-variant">{p.status || "Published"}</td>
                        <td className="p-4 text-right">
                          {adjustProductId === p.id ? (
                            <form onSubmit={handleAdjustSubmit} className="flex gap-2 justify-end items-center bg-surface-container-low p-2 rounded max-w-xs ml-auto">
                              <input
                                type="number"
                                required
                                value={adjustValue}
                                onChange={(e) => setAdjustValue(parseInt(e.target.value) || 0)}
                                className="w-14 p-1.5 border rounded bg-surface text-center font-mono"
                              />
                              <input
                                type="text"
                                required
                                placeholder="Reason (e.g. restock)"
                                value={adjustReason}
                                onChange={(e) => setAdjustReason(e.target.value)}
                                className="w-32 p-1.5 border rounded bg-surface text-[10px]"
                              />
                              <button type="submit" className="bg-primary text-white px-2 py-1.5 rounded font-bold cursor-pointer border-none text-[10px]">
                                Save
                              </button>
                              <span
                                onClick={() => setAdjustProductId(null)}
                                className="material-symbols-outlined text-[16px] text-error cursor-pointer"
                              >
                                close
                              </span>
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                setAdjustValue(10);
                                setAdjustProductId(p.id);
                              }}
                              className="bg-surface border border-outline hover:bg-surface-container px-3 py-1 rounded font-bold text-[10px] cursor-pointer"
                            >
                              Adjust Stock
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Stock Audit logs (Col 1) */}
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-label-md text-xs font-bold uppercase tracking-wider text-primary">
              Inventory Log Trail
            </h3>
            <div className="divide-y divide-outline-variant/15 font-mono text-[9px] text-on-surface-variant max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col gap-1 text-left">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">{log.productTitle}</span>
                    <span className="text-[8px] opacity-75">{log.timestamp}</span>
                  </div>
                  <p className="text-on-surface mt-0.5">
                    Adjusted: <strong className={log.newStock >= log.previousStock ? "text-[#137333]" : "text-error"}>
                      {log.previousStock} ➔ {log.newStock}
                    </strong>
                  </p>
                  <p className="text-[8px] text-on-surface-variant/80 italic mt-0.5">Reason: "{log.reason}" by {log.adjustedBy}</p>
                </div>
              ))}
              {logs.length === 0 && (
                <p className="text-center py-6 text-on-surface-variant italic">No adjustments logged.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
