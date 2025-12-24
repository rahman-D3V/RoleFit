import React from "react";

const LogoutToast = () => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white shadow-lg border">
        <span className="w-4 h-4 border-2 border-gray-300 border-t-teal-600 rounded-full animate-spin" />
        <span className="text-sm font-medium text-gray-700">Logging out…</span>
      </div>
    </div>
  );
};

export default LogoutToast;
