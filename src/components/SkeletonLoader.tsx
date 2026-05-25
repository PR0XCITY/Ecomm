import React from "react";

export const CardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/10 relative overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-surface-container-high" />
      <div className="p-5 space-y-3 flex-grow">
        <div className="h-4 bg-surface-container-high rounded w-1/4" />
        <div className="h-5 bg-surface-container-high rounded w-3/4" />
        <div className="h-4 bg-surface-container-high rounded w-1/3 mt-auto" />
      </div>
    </div>
  );
};

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-desktop items-start animate-pulse text-left py-12 md:py-24">
      <div className="w-full relative rounded-xl overflow-hidden bg-surface-container-high aspect-[4/5]" />
      <div className="flex flex-col space-y-8 pl-0 md:pl-8">
        <div className="space-y-4 border-b border-outline-variant pb-8">
          <div className="h-6 bg-surface-container-high rounded w-1/4" />
          <div className="h-10 bg-surface-container-high rounded w-3/4" />
          <div className="h-8 bg-surface-container-high rounded w-1/3" />
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-surface-container-high rounded w-1/3" />
          <div className="h-4 bg-surface-container-high rounded w-full" />
          <div className="h-4 bg-surface-container-high rounded w-5/6" />
          <div className="h-4 bg-surface-container-high rounded w-4/5" />
        </div>
        <div className="space-y-6 pt-4 border-t border-outline-variant">
          <div className="h-4 bg-surface-container-high rounded w-1/4" />
          <div className="h-12 bg-surface-container-high rounded w-full" />
          <div className="h-4 bg-surface-container-high rounded w-1/3" />
          <div className="h-10 bg-surface-container-high rounded w-32" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="border border-outline-variant rounded-xl overflow-hidden shadow-sm bg-surface-container-lowest animate-pulse">
      <div className="h-14 bg-surface-container-low border-b border-outline-variant" />
      <div className="divide-y divide-outline-variant">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-6 flex items-center justify-between gap-4">
            <div className="h-5 bg-surface-container-high rounded w-1/12" />
            <div className="h-5 bg-surface-container-high rounded w-2/12" />
            <div className="h-5 bg-surface-container-high rounded w-4/12" />
            <div className="h-5 bg-surface-container-high rounded w-1/12" />
            <div className="h-5 bg-surface-container-high rounded w-1/12" />
            <div className="h-5 bg-surface-container-high rounded w-2/12" />
          </div>
        ))}
      </div>
    </div>
  );
};
