"use client";

import { colors } from "@/config/colors";
import React, { useEffect, useState } from "react";
import { useUser } from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import LogoutToast from "./logoutToast";
import { HiMenu } from "react-icons/hi";

const Navbar = () => {
  const router = useRouter();
  const isUserLogin = useUser((s) => s.isUserLogin);
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  let authData = null;

  if (typeof window !== "undefined") {
    authData = JSON.parse(localStorage.getItem("auth-data"));
  }

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

    
      setIsUserLogin(authData.isLogin);
   
  }

  // Navigation buttons reusable content
  const NavButtons = (
    <>
      {pathname == "/" && (
        <a href="#works">
          <button
            className="w-full sm:w-auto px-6 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-all hover:bg-gray-200"
            style={{ color: colors.carbonGray }}
            onClick={() => setIsMenuOpen(false)}
          >
            How it works
          </button>
        </a>
      )}

      {authData?.isLogin && pathname == "/" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              router.push("/profile");
              setIsMenuOpen(false);
            }}
            className="w-full sm:w-auto px-6 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-all hover:bg-gray-200"
            style={{ color: colors.carbonGray }}
          >
            Profile
          </button>
          <button
            onClick={() => {
              router.push("/jd-analyzer");
              setIsMenuOpen(false);
            }}
            className="w-full sm:w-auto px-6 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-all hover:bg-gray-200"
            style={{ color: colors.carbonGray }}
          >
            JD-Analyzer
          </button>
        </div>
      )}
      {authData?.isLogin && pathname == "/profile" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              router.push("/jd-analyzer");
              setIsMenuOpen(false);
            }}
            className="w-full sm:w-auto px-6 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-all hover:bg-gray-200"
            style={{ color: colors.carbonGray }}
          >
            JD-Analyzer
          </button>
        </div>
      )}

      <button
        className="w-full sm:w-auto px-6 py-2.5 cursor-pointer text-sm font-semibold text-white rounded-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{ backgroundColor: colors.deepTeal }}
        onClick={() => {
          if (isUserLogin) handleLogout();
          else router.push("/login");
          setIsMenuOpen(false);
        }}
      >
        {authData?.isLogin ? "Logout" : "Login"}
      </button>
    </>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
            style={{ backgroundColor: colors.deepTeal }}
          >
            RF
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: colors.carbonGray }}
          >
            RoleFit
          </span>
        </div>

        {/* Hamburger Menu for mobile */}
        <button
          className="sm:hidden flex items-center text-2xl p-2"
          aria-label="Open Menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
        >
          <HiMenu  className="text-black"/>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-2">{NavButtons}</div>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`sm:hidden transition-all duration-200 ${
          isMenuOpen ? "max-h-screen py-3 px-3" : "max-h-0 overflow-hidden py-0 px-0"
        } bg-white/95 shadow`}
      >
        <div className="flex flex-col gap-2">{NavButtons}</div>
      </div>

      {isLoggingOut && <LogoutToast />}
    </nav>
  );
};

export default Navbar;
