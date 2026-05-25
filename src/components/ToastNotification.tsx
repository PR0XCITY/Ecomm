import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const getAlertStyle = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return "bg-surface border-secondary text-primary shadow-sm";
      case "error":
        return "bg-error-container border-error text-on-error-container shadow-sm";
      case "info":
      default:
        return "bg-surface-container-high border-outline text-on-surface shadow-sm";
    }
  };

  const getIcon = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return (
          <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        );
      case "error":
        return (
          <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            error
          </span>
        );
      case "info":
      default:
        return (
          <span className="material-symbols-outlined text-primary text-[20px]">
            info
          </span>
        );
    }
  };

  return (
    <div className="fixed top-20 right-4 md:right-margin-desktop z-50 flex flex-col gap-3 w-full max-w-[320px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border font-body-md text-sm premium-shadow ${getAlertStyle(
              toast.type
            )}`}
          >
            <div className="flex items-center gap-2.5">
              {getIcon(toast.type)}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default ToastNotification;
