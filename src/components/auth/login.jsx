import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import React, { useState } from "react";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const setIsUserLogin = useUser((s) => s.setIsUserLogin);

  function handleLogin() {
    try {
      let authData = JSON.parse(localStorage.getItem("auth-data"));
      if (authData?.userName == username && authData?.password == password) {
        alert("signin success");

        let updatedAuthData = { ...authData, isLogin: true };
        localStorage.setItem("auth-data", JSON.stringify(updatedAuthData));
        setIsUserLogin(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      alert(err);
    }
  }

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
        Enter your name or email to start.
      </p>

      <form>
        <label className="block text-sm mb-2">Username</label>
        <input
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-3 rounded-md mb-4 border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
          placeholder="Enter username"
          type="text"
        />

        <label className="block text-sm mb-2">Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-md mb-4 border"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
          placeholder="Enter password"
          type="password"
        />

        <button
          onClick={handleLogin}
          type="button"
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
};

export default Login;
