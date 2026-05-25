import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export const AdminLogin: React.FC = () => {
  const { loginAdmin, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both administrative credentials.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      await loginAdmin(email.trim(), password);
      addToast("Welcome back! Admin session established.", "success");
      navigate("/admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Try again.");
      addToast(err.message || "Authentication failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center px-4 relative text-left select-none">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center z-0 opacity-40">
        <div className="w-[500px] h-[500px] bg-primary-fixed-dim rounded-full blur-[100px] absolute -top-20 -right-20"></div>
        <div className="w-[300px] h-[300px] bg-secondary-fixed rounded-full blur-[80px] absolute -bottom-10 -left-10"></div>
      </div>

      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/30 rounded-xl premium-shadow p-8 z-10 relative">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/20 via-primary to-secondary/20"></div>

        <div className="text-center mb-8">
          <h1 className="font-display-lg text-primary text-2xl font-bold flex justify-center items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            Shuffling Smiles
          </h1>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            Administrative Management Login
          </p>
        </div>

        {errorMsg && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-semibold mb-6 flex items-start gap-2 border border-error/15">
            <span className="material-symbols-outlined shrink-0 text-[18px]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-on-surface-variant font-semibold">
          <div>
            <label className="block mb-1 text-[11px] font-bold text-on-surface uppercase tracking-wide">
              Staff Email Address
            </label>
            <div className="relative">
              <input
                required
                type="email"
                placeholder="admin@shufflingsmiles.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline rounded-lg focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 text-xs font-mono"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] opacity-60">
                mail
              </span>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-[11px] font-bold text-on-surface uppercase tracking-wide">
              Security Password
            </label>
            <div className="relative">
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-outline rounded-lg focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 text-xs font-mono"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] opacity-60">
                lock
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-on-primary py-3.5 rounded-lg hover:bg-primary-container hover:text-on-primary-container hover:shadow-md transition-all active:scale-[0.98] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border-none"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Portal...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">key</span>
                <span>Enter Administration</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
          <p className="text-[10px] text-on-surface-variant font-medium leading-relaxed">
            Authorized Personnel Only. Security audits are recorded in real-time.
            <br />
            Return to the <Link to="/" className="text-primary hover:underline font-bold">Storefront Portal</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
