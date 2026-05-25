import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
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
  Cell,
  PieChart,
  Pie
} from "recharts";
import { TableSkeleton } from "../../components/SkeletonLoader";

export const AdminAnalytics: React.FC = () => {
  const { orders } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-headline-md text-2xl text-on-surface">Advanced Storefront Analytics</h2>
        <TableSkeleton />
      </div>
    );
  }

  // 1. Sales Performance Trends
  const salesTrendData = [
    { date: "May 10", revenue: 42000, orders: 4 },
    { date: "May 12", revenue: 58000, orders: 6 },
    { date: "May 14", revenue: 95000, orders: 11 },
    { date: "May 16", revenue: 120000, orders: 14 },
    { date: "May 18", revenue: 84000, orders: 9 },
    { date: "May 20", revenue: 145000, orders: 15 },
    { date: "May 22", revenue: 198000, orders: 21 },
    { date: "May 24", revenue: 210000, orders: 23 },
    { date: "May 26", revenue: 245000, orders: 27 },
  ];

  // 2. Conversion Funnel Analysis
  const conversionFunnelData = [
    { stage: "Storefront Visitors", sessions: 12500, percentage: 100 },
    { stage: "Product View Sessions", sessions: 8400, percentage: 67 },
    { stage: "Add to Bag Drawer", sessions: 2200, percentage: 17.6 },
    { stage: "Initiated Checkout", sessions: 1100, percentage: 8.8 },
    { stage: "Completed Purchase", sessions: 478, percentage: 3.82 },
  ];

  // 3. Order Status Pie Chart
  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Shipped: 0, Delivered: 0, Cancelled: 0, Refunded: 0 } as Record<string, number>
  );

  const orderStatusData = [
    { name: "Delivered", value: statusCounts.Delivered || 8, color: "#137333" },
    { name: "Shipped", value: statusCounts.Shipped || 4, color: "#755b00" },
    { name: "Pending", value: statusCounts.Pending || 3, color: "#4e0816" },
    { name: "Refunded", value: statusCounts.Refunded || 1, color: "#df9f28" },
    { name: "Cancelled", value: statusCounts.Cancelled || 1, color: "#877273" },
  ];

  // 4. Acquisition Channels
  const acquisitionData = [
    { channel: "Instagram Ads", conversionRate: 4.2, revenue: 185000 },
    { channel: "Google Search", conversionRate: 3.1, revenue: 120000 },
    { channel: "WhatsApp Referrals", conversionRate: 5.6, revenue: 95000 },
    { channel: "Direct Traffic", conversionRate: 2.8, revenue: 65000 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-outline-variant/20 pb-4">
        <h2 className="font-headline-md text-2xl text-on-surface">Storefront Sales &amp; Conversions</h2>
        <p className="text-xs text-on-surface-variant mt-1">Deep insight analytics of customer traffic, acquisition channels, and checkout funnels.</p>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-left">
        
        {/* Sales Area Chart (Col 2) */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-6 text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">trending_up</span>
            Revenue Growth Progression
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4e0816" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4e0816" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e9e4" vertical={false} />
                <XAxis dataKey="date" stroke="#877273" fontSize={10} />
                <YAxis stroke="#877273" fontSize={10} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#4e0816" strokeWidth={2.5} fillOpacity={1} fill="url(#analyticsColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-4 text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">pie_chart</span>
            Fulfillment Logistics Status
          </h3>
          
          <div className="h-48 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-outline-variant/10 pt-4 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 font-bold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.value} orders</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel Bar Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-6 text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">filter_alt</span>
            Shopping Funnel Conversion Analysis
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionFunnelData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e9e4" horizontal={false} />
                <XAxis type="number" stroke="#877273" fontSize={10} domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="stage" stroke="#877273" fontSize={10} width={120} />
                <Tooltip formatter={(value) => [`${value}%`, "Conversion Retention"]} />
                <Bar dataKey="percentage" fill="#755b00" radius={[0, 4, 4, 0]}>
                  {conversionFunnelData.map((_, index) => {
                    const colors = ["#4e0816", "#755b00", "#99424c", "#ca9a05", "#e7b416"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marketing Channels */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between">
          <h3 className="font-label-md text-xs font-bold uppercase tracking-wider mb-4 text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">campaign</span>
            Acquisition Channels
          </h3>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {acquisitionData.map((item, idx) => (
              <div key={idx} className="border-b border-outline-variant/10 pb-3 last:border-b-0">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-primary">{item.channel}</span>
                  <span className="text-secondary font-mono">₹{item.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                  <span>Conversion Rate</span>
                  <span className="font-bold text-[#137333]">{item.conversionRate}%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-secondary"
                    style={{ width: `${(item.revenue / 200000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
