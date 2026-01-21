"use client";

import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function SignUp() {
  const router = useRouter();
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);

  const [isAccountCreating, setIsAccountCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const authData = {
      userName: data.userName,
      email: data.email,
      password: data.password,
      isLogin: true,
    };

    try {
      setIsAccountCreating(true);
      localStorage.setItem("auth-data", JSON.stringify(authData));
      setIsUserLogin(true);
      setTimeout(() => {
        setIsAccountCreating(false);
        router.push("/profile");
      }, 2000);
    } catch (error) {
      // keep this simple for the prototype
      alert("Failed to save account");
      console.error(error);
    }
  };

  function handleRef() {
    setValue("userName", "User01");
    setValue("email", "user1@gmail.com");
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
          className="w-12 h-12 rounded-xl flex items-center justify-center
      font-semibold text-white
      bg-gradient-to-br from-purple-500 to-indigo-500
      "
        >
          RF
        </div>
        <div>
          <div className="font-semibold text-lg">RoleFit</div>
          <div className="text-xs text-purple-200/60">Create your account</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
      <p className="text-sm text-purple-200/70 mb-6">
        Create a free RoleFit account to get started.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3 mb-4">
          {/* Username */}
          <label className="block text-sm text-purple-200/80">Username</label>
          <input
            {...register("userName", { required: "username is required" })}
            className="w-full p-3 rounded-lg
        bg-black/30 border border-white/10
        text-white placeholder-purple-200/40
        focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Enter username"
            type="text"
          />
          {errors.userName && (
            <p className="text-xs mt-1 text-red-400">
              {errors.userName.message}
            </p>
          )}

          {/* Email */}
          <label className="block text-sm text-purple-200/80">Email</label>
          <input
            id="emailInput"
            {...register("email", {
              required: "email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-3 rounded-lg
        bg-black/30 border border-white/10
        text-white placeholder-purple-200/40
        focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="you@example.com"
            type="email"
          />
          {errors.email && (
            <p className="text-xs mt-1 text-red-400">{errors.email.message}</p>
          )}

          {/* Password */}
          <label className="block text-sm text-purple-200/80">Password</label>
          <div className="relative">
            <input
              {...register("password", { required: "password is required" })}
              className="w-full p-3 rounded-lg pr-10
          bg-black/30 border border-white/10
          text-white placeholder-purple-200/40
          focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              placeholder="Create a password"
              type={showPassword ? "text" : "password"}
            />

            <div
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2
          text-purple-300 cursor-pointer
          hover:text-white transition"
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiEye size={17} /> : <HiEyeOff size={17} />}
            </div>
          </div>
          {errors.password && (
            <p className="text-xs mt-1 text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full p-3 rounded-lg font-medium text-white
      bg-gradient-to-r from-purple-500 to-indigo-500
      
      hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
      transition ${isAccountCreating && "animate-pulse"}`}
        >
          {isAccountCreating ? "Creating your account…" : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <div className="text-xs text-purple-200/50 mt-5">
        This is a prototype. Nothing is stored on servers.
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
