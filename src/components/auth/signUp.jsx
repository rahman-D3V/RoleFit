"use client";

import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function SignUp() {
  const router = useRouter();
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);

  const [isAccountCreating, setIsAccountCreating] = useState(false);

  const emailRef = useRef(null);

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
      className="rounded-xl p-6 shadow-md"
      style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: colors.deepTeal,
          }}
          className="flex items-center justify-center text-white font-semibold"
        >
          M
        </div>
        <div>
          <div className="font-semibold text-lg">Matchify</div>
          <div className="text-xs text-gray-500">Create your account</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
      <p className="text-sm text-gray-600 mb-6">
        Create a free Matchify account to get started.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3 mb-3">
          <label className="block text-sm">Username</label>
          <input
            {...register("userName", { required: "username is required" })}
            className="w-full p-3 rounded-md border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            placeholder="Enter username"
            type="text"
          />
          {errors.userName && (
            <p className="text-xs mt-1" style={{ color: "#B04434" }}>
              {errors.userName.message}
            </p>
          )}

          <label className="block text-sm">Email</label>
          <input
            id="emailInput"
            {...register("email", {
              required: "email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-3 rounded-md border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            placeholder="you@example.com"
            type="email"
          />
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: "#B04434" }}>
              {errors.email.message}
            </p>
          )}

          <label className="block text-sm">Password</label>
          <input
            {...register("password", { required: "password is required" })}
            className="w-full p-3 rounded-md border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            placeholder="Create a password"
            type="password"
          />
          {errors.password && (
            <p className="text-xs mt-1" style={{ color: "#B04434" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full p-3 rounded-md text-white font-medium"
            style={{ background: colors.deepTeal }}
          >
            {isAccountCreating ? "Creating your account…" : "Create Account"}
          </button>
        </div>
      </form>

      <div className="text-xs text-gray-500 mt-4">
        This is a prototype. Nothing is stored on servers.
      </div>

      <button
        className="px-3 py-1.5 mt-2 rounded-md cursor-pointer text-sm bg-teal-50 text-teal-700 hover:bg-teal-100"
        onClick={handleRef}
      >
        Use demo credentials
      </button>
    </div>
  );
}
