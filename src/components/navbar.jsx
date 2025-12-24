import { colors } from "@/config/colors";
import React, { useEffect, useState } from "react";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import LogoutToast from "./logoutToast";

const Navbar = () => {
  const router = useRouter();
  const isUserLogin = useUser((s) => s.isUserLogin);
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  let authData = JSON.parse(localStorage.getItem("auth-data"));

  function handleLogout() {
    setIsLoggingOut(true);

    setTimeout(() => {
      setIsLoggingOut(false);
      setIsUserLogin(false);
      try {
        let authData = JSON.parse(localStorage.getItem("auth-data"));
        authData = { ...authData, isLogin: false };
        localStorage.setItem("auth-data", JSON.stringify(authData));
      } catch (error) {
        alert(error);
      }

      router.push("/");
    }, 1500);

    useEffect(() => {
      setIsUserLogin(authData.isLogin);
    }, []);
  }
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
            style={{ backgroundColor: colors.deepTeal }}
          >
            M
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: colors.carbonGray }}
          >
            RoleFit
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="px-6 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-all hover:bg-gray-200"
            style={{ color: colors.carbonGray }}
            onClick={isUserLogin ? handleLogout : () => router.push("/login")}
          >
            {authData.isLogin ? "Logout" : "Login"}
          </button>

          <button
            className="px-6 py-2.5 cursor-pointer text-sm font-semibold text-white rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: colors.deepTeal }}
          >
            Get Started
          </button>
        </div>
      </div>

      {isLoggingOut && <LogoutToast />}
    </nav>
  );
};

export default Navbar;
