import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { reviewService } from "../../services/reviewService";
import type { Review } from "../../mock/mockData";

export const AdminReviews: React.FC = () => {
  const { addToast, reloadReviews } = useApp();
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getReviews(true);
      setReviewsList(data);
    } catch {
      addToast("Failed to fetch customer reviews.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await reviewService.approveReview(id);
      addToast("Review approved.");
      await loadReviews();
      await reloadReviews();
    } catch {
      addToast("Failed to approve review.", "error");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Reject and delete this review?")) return;
    try {
      await reviewService.rejectReview(id);
      addToast("Review rejected.");
      await loadReviews();
      await reloadReviews();
    } catch {
      addToast("Failed to reject review.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
        <div>
          <h2 className="font-headline-md text-2xl text-on-surface">Reviews Moderation</h2>
          <p className="text-xs text-on-surface-variant mt-1">Approve, reject, or filter user comments.</p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-6 text-xs text-on-surface-variant">Checking review queue...</p>
      ) : (
        <div className="space-y-4 text-xs text-left">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 border border-outline-variant/30 rounded-xl bg-surface-lowest flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface text-sm">{rev.author}</span>
                  <span className="text-on-surface-variant font-mono text-[10px]">{rev.date}</span>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${rev.approved ? "bg-[#e6f4ea] text-[#137333]" : "bg-primary-fixed text-on-primary-fixed-variant animate-pulse"}`}>
                    {rev.approved ? "Approved" : "Pending Action"}
                  </span>
                </div>
                <p className="text-[10px] text-primary font-mono font-semibold">Product ID: {rev.productId}</p>
                <div className="flex text-secondary">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span
                      key={idx}
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: `'FILL' ${idx < rev.rating ? "1" : "0"}` }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-on-surface-variant text-sm mt-1">{rev.comment}</p>
              </div>
              <div className="flex gap-2 shrink-0 self-end md:self-center font-bold">
                {!rev.approved && (
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="bg-[#137333] text-white hover:opacity-90 px-3.5 py-1.5 rounded text-xs font-bold cursor-pointer flex items-center gap-0.5 border-none"
                  >
                    <span className="material-symbols-outlined text-[14px]">done</span>
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleReject(rev.id)}
                  className="bg-error-container text-error hover:bg-error/10 px-3.5 py-1.5 rounded text-xs font-bold cursor-pointer flex items-center gap-0.5 border-none"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  Reject
                </button>
              </div>
            </div>
          ))}
          {reviewsList.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant font-semibold">
              No product reviews currently recorded.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
