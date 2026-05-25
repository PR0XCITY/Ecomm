import React from "react";
import { useNavigate } from "react-router-dom";

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-left">
      <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          gpp_bad
        </span>
      </div>
      <h1 className="font-display-lg text-2xl md:text-3xl text-primary mb-2 font-bold">
        Access Denied
      </h1>
      <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-8 leading-relaxed">
        Your administrative account role does not have the required permissions to view this configuration tab. Please contact your Super Administrator for access privileges.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer border-none"
        >
          Return to Dashboard
        </button>
        <button
          onClick={() => navigate("/")}
          className="border border-outline text-on-surface hover:bg-surface-container px-6 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          Go to Storefront
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
