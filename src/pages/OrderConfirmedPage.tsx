import React, { useEffect } from "react";
import { useApp } from "../context/AppContext";
import confetti from "canvas-confetti";

export const OrderConfirmedPage: React.FC = () => {
  const { confirmedOrderId, orders, navigateTo } = useApp();

  // Try to find the placed order
  const order = orders.find((o) => o.id === confirmedOrderId);

  // Default values to match the mockup exactly if navigated directly or order not found
  const defaultOrder = {
    id: "#SS-8472910",
    customerName: "Aanya Sharma",
    date: "Oct 24, 2024",
    total: 345.00,
    currency: "USD",
    totalFormatted: "$345.00",
    paymentMethod: "Visa ending 4242",
    items: [
      {
        id: "midnight-garden-suite",
        title: "Midnight Garden Wedding Suite",
        quantity: 100,
        details: "Bespoke Deep Burgundy",
        price: 2.80,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWoO6pxjaTD9vRq2fR1vjfDCAtn0VT9jpA5d_8H3TzY1-x2kpxKZCFq0WkYl3g68R6-LJ5t4Uq4GLcCez1H6b2v3CgDEgjW6S8nM8rcBaO0SJItnTV7qUw7Pi818blfeGMDjVLRXJyQiJNynEtr7qDY822r1xTqYJY3XVHkJlX_qMlaeP-yOjghUyqrY7STrZ8ZaTbxm2YuTgJbi3283iVczP3E7GUqLbEkzcrl_cNX6zsopPSLC_gtMuku6pyzvm5r5E8eT0E"
      }
    ],
    subtotal: 280.00,
    shipping: 20.00
  };

  const displayOrder = order
    ? {
        id: order.id,
        customerName: order.customerName,
        date: order.date,
        total: order.total,
        currency: order.currency,
        totalFormatted: order.totalFormatted,
        paymentMethod: order.paymentMethod,
        items: order.items,
        subtotal: order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        shipping: order.currency === "INR" ? 300 : 10.00
      }
    : defaultOrder;

  const displayTotal = displayOrder.total;
  const displaySubtotal = displayOrder.subtotal;
  const displayShipping = displayOrder.shipping;

  const formatValue = (value: number, currency: string) => {
    return currency === "INR" ? `₹ ${value.toLocaleString()}` : `$${value.toFixed(2)}`;
  };

  // Trigger celebration on mount
  useEffect(() => {
    // Left-side burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.2, y: 0.6 }
    });
    // Right-side burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.8, y: 0.6 }
    });
  }, []);

  return (
    <div className="flex-grow flex items-center justify-center py-margin-desktop px-margin-mobile md:px-margin-desktop w-full relative text-left">
      {/* Subtle background decoration (abstract soft shapes) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0 opacity-40">
        <div className="w-[600px] h-[600px] bg-primary-fixed-dim rounded-full blur-[120px] absolute -top-40 -right-40"></div>
        <div className="w-[400px] h-[400px] bg-secondary-fixed rounded-full blur-[100px] absolute -bottom-20 -left-20"></div>
      </div>

      {/* Premium Confirmation Card */}
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-xl premium-shadow border border-outline-variant/30 p-8 md:p-12 z-10 relative overflow-hidden my-12">
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/20 via-primary to-secondary/20"></div>

        {/* Header Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[40px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary mb-2">Order Confirmed!</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto text-balance">
            Thank you for choosing Shuffling Smiles. We are preparing your bespoke celebration items with sophisticated joy.
          </p>
        </div>

        {/* Live Stepper Tracker */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant/10 mb-10">
          <h3 className="font-label-md text-primary uppercase tracking-wider mb-8 text-center text-xs">
            Live Order Progress
          </h3>
          <div className="flex justify-between items-center max-w-xl mx-auto relative px-4 text-xs">
            {[
              { num: 1, label: "Ordered", icon: "task_alt", active: true },
              { num: 2, label: "Packaging", icon: "inventory", active: true },
              { num: 3, label: "Shipped", icon: "local_shipping", active: false },
              { num: 4, label: "Delivered", icon: "verified", active: false },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      step.active
                        ? "bg-secondary text-on-secondary shadow-sm"
                        : "bg-surface text-on-surface-variant border border-outline-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {step.icon}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-bold absolute -bottom-5 whitespace-nowrap ${
                      step.active ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div
                    className={`flex-grow h-1 mx-1 rounded transition-colors duration-500 relative z-0 ${
                      step.num === 1 ? "bg-secondary" : "bg-outline-variant/20"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant">
              Bespoke layout compilation is starting. Track shipping coordinates inside your dashboard.
            </p>
          </div>
        </div>

        {/* Order Meta Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-outline-variant/40 mb-10 text-center md:text-left">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Order ID</p>
            <p className="font-body-md text-body-md text-on-surface font-semibold">{displayOrder.id}</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Date</p>
            <p className="font-body-md text-body-md text-on-surface font-semibold">{displayOrder.date}</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Total</p>
            <p className="font-body-md text-body-md text-on-surface font-semibold">
              {formatValue(displayTotal, displayOrder.currency)}
            </p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1 uppercase tracking-wider">Payment</p>
            <p className="font-body-md text-body-md text-on-surface font-semibold">{displayOrder.paymentMethod}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-10">
          <h2 className="font-headline-sm text-headline-sm text-primary mb-4 border-b border-outline-variant/30 pb-2">
            Order Summary
          </h2>
          <div className="flex flex-col gap-4">
            {displayOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded bg-surface-variant overflow-hidden shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt={item.title}
                    src={item.image}
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-body-md text-body-md font-semibold text-on-surface">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
                    Qty: {item.quantity} {item.details ? `• ${item.details}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-body-md text-body-md font-semibold text-on-surface">
                    {formatValue(item.price * item.quantity, displayOrder.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-outline-variant/30 text-right">
            <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
              <span>Subtotal</span>
              <span>{formatValue(displaySubtotal, displayOrder.currency)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant font-body-md text-body-md">
              <span>Shipping</span>
              <span>{formatValue(displayShipping, displayOrder.currency)}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigateTo("account")}
            className="bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider px-10 py-4 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors duration-300 shadow-sm hover:shadow-md cursor-pointer border-none"
          >
            Track in Account
          </button>
          <button
            onClick={() => navigateTo("home")}
            className="border border-outline text-on-surface font-label-md text-label-md uppercase tracking-wider px-10 py-4 rounded-lg hover:bg-surface-container-low transition-colors duration-300 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderConfirmedPage;
