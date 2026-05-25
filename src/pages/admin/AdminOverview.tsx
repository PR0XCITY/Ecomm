import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { analyticsService } from "../../services/analyticsService";
import type { DashboardStats } from "../../services/analyticsService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminOverview: React.FC = () => {
  const { logs } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await analyticsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error loading analytics stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatPrice = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <h2 className="font-headline-md text-2xl text-on-surface">Overview Dashboard</h2>
        <TableSkeleton />
      </div>
    );
  }

  // Recharts Trends Mock Data (monthly)
  const monthlyRevenueData = [
    { month: "Jan", revenue: 142000, orders: 12 },
    { month: "Feb", revenue: 215000, orders: 18 },
    { month: "Mar", revenue: 198000, orders: 15 },
    { month: "Apr", revenue: 320000, orders: 24 },
    { month: "May", revenue: stats.revenueThisMonth, orders: 35 },
  ];

  const categoryDistributionData = [
    { name: "Stationery", value: 45, color: "#4e0816" },
    { name: "Cards", value: 30, color: "#755b00" },
    { name: "Badges", value: 15, color: "#99424c" },
    { name: "Others", value: 10, color: "#dac0c1" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-headline-md text-2xl text-on-surface">Dashboard Analytics</h2>
        <p className="text-xs text-on-surface-variant mt-1">Real-time indicators of Shuffling Smiles storefront performance.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Revenue Today</span>
          <p className="font-headline-md text-xl font-bold text-primary mt-2">
            {formatPrice(stats.revenueToday)}
          </p>
          <span className="text-[9px] text-[#137333] font-semibold mt-1">
            ▲ {stats.ordersToday} orders placed
          </span>
        </div>

        {/* Widget 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Revenue This Month</span>
          <p className="font-headline-md text-xl font-bold text-primary mt-2">
            {formatPrice(stats.revenueThisMonth)}
          </p>
          <span className="text-[9px] text-on-surface-variant font-medium mt-1">
            Sales volume total
          </span>
        </div>

        {/* Widget 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Avg Order Value</span>
          <p className="font-headline-md text-xl font-bold text-secondary mt-2">
            {formatPrice(stats.averageOrderValue)}
          </p>
          <span className="text-[9px] text-on-surface-variant font-medium mt-1">
            Average ticket size
          </span>
        </div>

        {/* Widget 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Conversion Rate</span>
          <p className="font-headline-md text-xl font-bold text-secondary mt-2">
            {stats.conversionRate}%
          </p>
          <span className="text-[9px] text-[#137333] font-semibold mt-1">
            ▲ 1.4% from last week
          </span>
        </div>
      </div>

      {/* Recharts Analytics Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (Col 2) */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-6 text-primary">
            Monthly Revenue Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4e0816" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4e0816" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e9e4" />
                <XAxis dataKey="month" stroke="#877273" fontSize={11} />
                <YAxis stroke="#877273" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#4e0816" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Share Bar Chart (Col 1) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-4 text-primary">
            Category Split
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistributionData}>
                <XAxis dataKey="name" fontSize={10} stroke="#877273" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#877273" radius={[4, 4, 0, 0]}>
                  {categoryDistributionData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-outline-variant/10 text-on-surface-variant font-mono">
            {categoryDistributionData.map((c) => (
              <div key={c.name} className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Recent Actions Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Products */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-4 text-primary">
            Top Selling Products
          </h3>
          <div className="divide-y divide-outline-variant/25">
            {stats.topSellingProducts.map((p, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-surface-container rounded overflow-hidden shrink-0">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">{p.title}</p>
                    <p className="text-[10px] text-on-surface-variant/80 mt-0.5">{p.count} units fanned</p>
                  </div>
                </div>
                <span className="text-secondary font-mono">{formatPrice(p.revenue)}</span>
              </div>
            ))}
            {stats.topSellingProducts.length === 0 && (
              <p className="text-center py-6 text-xs text-on-surface-variant">No sales recorded yet.</p>
            )}
          </div>
        </div>

        {/* Right: Recent Audit Log Feed */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-4 text-primary">
            Activity Log Feed
          </h3>
          <div className="divide-y divide-outline-variant/15 font-mono text-[10px] text-on-surface-variant">
            {logs.slice(0, 5).map((log, idx) => (
              <div key={idx} className="py-3 flex justify-between gap-4 items-start">
                <div>
                  <span className="text-primary font-bold">[{log.user}]</span>{" "}
                  <span className="text-on-surface font-semibold">{log.action}</span>
                </div>
                <span className="text-[9px] font-sans shrink-0 opacity-70 mt-0.5">{log.timestamp}</span>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center py-6">No recent actions recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
