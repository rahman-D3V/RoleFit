"use client";

import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const setIsUserLogin = useUser((s) => s.setIsUserLogin)

  function handleCreateAccount() {
    const authData = {
      userName,
      email,
      password,
      isLogin: true,
    };

    try {
      localStorage.setItem("auth-data", JSON.stringify(authData));
      alert("Account Created");
      setIsUserLogin(true)
    } catch (error) {
      alert(error);
    }

    router.push("/");
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
      <form>
        <div className="grid gap-3 mb-3">
          <label className="block text-sm">Username</label>
          <input
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 rounded-md border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            placeholder="Enter username"
            type="text"
          />

          <label className="block text-sm">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            placeholder="you@example.com"
            type="email"
          />

          <label className="block text-sm">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md border"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
            placeholder="Create a password"
            type="password"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCreateAccount}
            type="button"
            className="w-full p-3 rounded-md text-white font-medium"
            style={{ background: colors.deepTeal }}
          >
            Create Account
          </button>
        </div>
      </form>

      <div className="text-xs text-gray-500 mt-4">
        This is a prototype. Nothing is stored on servers.
      </div>
    </div>
  );
};

export default SignUp;
