"use client";
import Login from "@/components/auth/login";
import SignUp from "@/components/auth/signUp";
import { colors } from "@/config/colors";
import { useState } from "react";

export default function LoginPage() {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#07000f]">
  {/* Ambient background glow */}
  <div className="absolute inset-0 -z-10">
    <div
      className="absolute left-1/2 top-1/2 h-[900px] w-[900px]
      -translate-x-1/2 -translate-y-1/2 rounded-full
      bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_65%)]
      blur-3xl"
    />
  </div>

  {/* Auth card wrapper */}
  <div className="w-full max-w-md px-6">
    {isLoginPage ? <Login /> : <SignUp />}

    {/* Switch auth mode */}
    <div className="mt-6 text-center text-xs text-purple-200/60">
      {isLoginPage ? "New user?" : "Already a user?"}{" "}
      <span
        onClick={() => setIsLoginPage(!isLoginPage)}
        className="cursor-pointer
        text-purple-400 hover:text-purple-300
        hover:underline transition"
      >
        {isLoginPage ? "Sign Up" : "Sign In"}
      </span>
    </div>
  </div>
</div>

  );
}
