import React from "react";

const LogoutToast = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl
    bg-gradient-to-b from-white/10 to-white/5
    backdrop-blur-xl border border-white/15
    shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      >
        {/* Spinner */}
        <span
          className="w-4 h-4 border-2 border-white/30
      border-t-purple-400 rounded-full animate-spin"
        />

        {/* Text */}
        <span className="text-sm font-medium text-purple-200">
          Logging out…
        </span>
      </div>
    </div>
  );
};

export default LogoutToast;
