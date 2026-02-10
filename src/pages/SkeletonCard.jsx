import React from "react";

const SkeletonCard = () => {
  return (
    <div className="relative aspect-2/3 w-full bg-[#222] rounded-sm overflow-hidden shadow-lg shadow-black/50">
      {/* 🟢 THE SHIMMER OVERLAY */}
      {/* This creates the moving light effect seen on premium apps like Netflix */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
      
      {/* 🔴 BOTTOM CONTENT PLACEHOLDERS */}
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
        {/* Placeholder for Title */}
        <div className="h-3 w-3/4 bg-zinc-700 rounded-full animate-pulse"></div>
        
        {/* Placeholder for Match % and HD badge */}
        <div className="flex justify-between items-center">
          <div className="h-2 w-1/4 bg-zinc-800 rounded-full animate-pulse"></div>
          <div className="h-3 w-6 bg-zinc-800 rounded-sm animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;