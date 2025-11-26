"use client";
import Login from "@/components/auth/login";
import SignUp from "@/components/auth/signUp";
import { colors } from "@/config/colors";
import { useState } from "react";

export default function LoginPage() {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: colors.softIvory, color: colors.carbonGray }}
    >
      <div className="w-full max-w-md p-8">
        {isLoginPage ? <Login /> : <SignUp />}

        <div className="mt-6 text-center text-xs text-gray-500">
          {isLoginPage ? "New User?" : "Already User?"}{" "}
          <span
            onClick={() => setIsLoginPage(!isLoginPage)}
            className="hover:underline cursor-pointer"
          >
            {isLoginPage ? "Sign Up" : "Sign In"}
          </span>
        </div>
      </div>
    </div>
  );
}
