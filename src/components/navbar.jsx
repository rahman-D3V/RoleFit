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
      {pathname === "/" && (
        <a href="#works">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-full
          text-purple-200 hover:text-white
          hover:bg-white/5 transition"
          >
            How it works
          </button>
        </a>
      )}

      {authData?.isLogin && pathname === "/" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => {
              router.push("/profile");
              setIsMenuOpen(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-full
          text-purple-200 hover:text-white hover:bg-white/5 transition"
          >
            Profile
          </button>

          <button
            onClick={() => {
              router.push("/jd-analyzer");
              setIsMenuOpen(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-full
          text-purple-200 hover:text-white hover:bg-white/5 transition"
          >
            JD Analyzer
          </button>
        </div>
      )}

      {authData?.isLogin && pathname === "/profile" && (
        <button
          onClick={() => {
            router.push("/jd-analyzer");
            setIsMenuOpen(false);
          }}
          className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-full
        text-purple-200 hover:text-white hover:bg-white/5 transition"
        >
          JD Analyzer
        </button>
      )}

      <button
        onClick={() => {
          authData?.isLogin ? handleLogout() : router.push("/login");
          setIsMenuOpen(false);
        }}
        className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-full text-white
      bg-gradient-to-r from-purple-500 to-indigo-500
      shadow-[0_0_30px_rgba(168,85,247,0.45)]
      hover:shadow-[0_0_45px_rgba(168,85,247,0.7)]
      transition"
      >
        {authData?.isLogin ? "Logout" : "Login"}
      </button>
    </>
  );

  return (
    <nav className="sticky top-0 z-50">
      {/* Glow line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      <div className="relative bg-[#090012]/95 backdrop-blur-xl border-b border-white/5">
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg
          bg-gradient-to-br from-purple-500 to-indigo-500
          shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            >
              RF
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              RoleFit
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden text-2xl p-2 text-purple-300 hover:text-white transition"
            aria-label="Open Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
          >
            <HiMenu />
          </button>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center gap-2">{NavButtons}</div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`sm:hidden transition-all duration-300 ${
          isMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div
          className="mx-4 mt-3 rounded-2xl p-4
      bg-[#0b0018]/90 backdrop-blur-xl
      border border-purple-500/20
      shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <div className="flex flex-col gap-3">{NavButtons}</div>
        </div>
      </div>

      {isLoggingOut && <LogoutToast />}
    </nav>
  );
};

export default Navbar;
