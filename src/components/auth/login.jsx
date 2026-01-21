"use client";

import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Login() {
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);
  const router = useRouter();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCredentialsError, setIsCredentialsError] = useState(false);
  const [isAuthData, setIsAuthData] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth-data") || "null");

      if (!authData) {
        setIsAuthData(true);
        setTimeout(() => {
          setIsAuthData(false);
        }, 2000);
        return;
      }

      if (
        authData.userName === data.userName &&
        authData.password === data.password
      ) {
        setIsSigningIn(true);
        const updated = { ...authData, isLogin: true };
        localStorage.setItem("auth-data", JSON.stringify(updated));
        setIsUserLogin(true);

        setTimeout(() => {
          setIsSigningIn(false);
          router.push("/");
        }, 1500);
      } else {
        setIsCredentialsError(true);
        setTimeout(() => {
          setIsCredentialsError(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while signing in");
    }
  };

  function handleRef() {
    setValue("userName", "User01");
    setValue("password", "user111");
  }

  return (
    <div
      className="relative rounded-2xl p-8
  bg-gradient-to-b from-white/10 to-white/5
  backdrop-blur-xl border border-purple-500/20
  shadow-[0_20px_60px_rgba(0,0,0,0.6)]
  text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center
      font-semibold text-white
      bg-gradient-to-br from-purple-500 to-indigo-500
      "
        >
          RF
        </div>
        <div>
          <div className="font-semibold">RoleFit</div>
          <div className="text-xs text-purple-200/60">Quick sign-in</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Welcome</h2>
      <p className="text-sm text-purple-200/70 mb-6">
        Enter your username and password to sign in.
      </p>

      {/* Errors */}
      {isCredentialsError && (
        <div
          className="mb-6 px-4 py-2 rounded-lg
      bg-red-500/10 border border-red-500/30"
        >
          <span className="text-sm text-red-400 font-medium">
            Invalid credentials
          </span>
        </div>
      )}

      {isAuthData && (
        <div
          className="mb-6 px-4 py-2 rounded-lg
      bg-red-500/10 border border-red-500/30"
        >
          <span className="text-sm text-red-400 font-medium">
            No account found. Please create an account.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username */}
        <label className="block text-sm mb-2 text-purple-200/80">
          Username
        </label>
        <input
          {...register("userName", { required: "Username is required" })}
          className="w-full p-3 rounded-lg mb-2
      bg-black/30 border border-white/10
      text-white placeholder-purple-200/40
      focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          placeholder="Enter username"
          type="text"
        />
        {errors.userName && (
          <p className="text-xs mt-1 mb-2 text-red-400">
            {errors.userName.message}
          </p>
        )}

        {/* Password */}
        <label className="block text-sm mb-2 text-purple-200/80">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password", { required: "Password is required" })}
            className="w-full p-3 rounded-lg mb-2 pr-10
        bg-black/30 border border-white/10
        text-white placeholder-purple-200/40
        focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
          />

          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2
        text-purple-300 cursor-pointer hover:text-white transition"
            tabIndex={0}
            role="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <HiEye size={17} /> : <HiEyeOff size={17} />}
          </div>
        </div>

        {errors.password && (
          <p className="text-xs mt-1 mb-1 text-red-400">
            {errors.password.message}
          </p>
        )}

        {/* Submit */}
        {isSigningIn ? (
          <button
            type="submit"
            className="w-full p-3 mt-3 rounded-lg font-medium
        bg-gradient-to-r from-purple-500 to-indigo-500
        animate-pulse text-white"
          >
            signing in...
          </button>
        ) : (
          <button
            type="submit"
            className="w-full p-3 mt-3 rounded-lg font-medium text-white
        bg-gradient-to-r from-purple-500 to-indigo-500
        
        hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
        transition"
          >
            Continue
          </button>
        )}
      </form>

      {/* Footer text */}
      <div className="text-xs text-purple-200/50 mt-5">
        By continuing you agree this is a prototype demo. Your info stays in
        your browser.
      </div>

      <button
        className="mt-3 text-sm px-4 py-2 rounded-lg
    bg-purple-500/10 text-purple-300
    hover:bg-purple-500/20 transition"
        onClick={handleRef}
      >
        Use demo credentials
      </button>
    </div>
  );
}

// signing in...
