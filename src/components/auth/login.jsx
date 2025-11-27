"use client";

import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function Login() {
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth-data") || "null");

      if (!authData) {
        alert("No account found. Please sign up first.");
        return;
      }

      if (
        authData.userName === data.userName &&
        authData.password === data.password
      ) {
        const updated = { ...authData, isLogin: true };
        localStorage.setItem("auth-data", JSON.stringify(updated));
        setIsUserLogin(true);
        alert("Sign in successful");
        router.push("/profile");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while signing in");
    }
  };

  return (
    <div className="rounded-xl p-6 shadow-md" style={{ background: "white" }}>
      <div className="flex items-center gap-3 mb-4">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: colors.deepTeal,
          }}
          className="flex items-center justify-center text-white font-semibold"
        >
          M
        </div>
        <div>
          <div className="font-semibold">Matchify</div>
          <div className="text-xs text-gray-600">Quick sign-in</div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Welcome</h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter your username and password to sign in.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block text-sm mb-2">Username</label>
        <input
          {...register("userName", { required: "this field is required" })}
          className="w-full p-3 rounded-md mb-4 border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
          placeholder="Enter username"
          type="text"
        />
        {errors.userName && (
          <p className="text-xs mt-1" style={{ color: "#B04434" }}>
            {errors.userName.message}
          </p>
        )}

        <label className="block text-sm mb-2">Password</label>
        <input
          {...register("password", { required: "this field is required" })}
          className="w-full p-3 rounded-md mb-4 border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
          placeholder="Enter password"
          type="password"
        />
        {errors.password && (
          <p className="text-xs mt-1" style={{ color: "#B04434" }}>
            {errors.password.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full p-3 rounded-md text-white font-medium mt-2"
          style={{ background: colors.deepTeal }}
        >
          Continue
        </button>
      </form>

      <div className="text-xs text-gray-500 mt-4">
        By continuing you agree this is a prototype demo. Your info stays in
        your browser.
      </div>
    </div>
  );
}
