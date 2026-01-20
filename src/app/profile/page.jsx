"use client";

import Navbar from "@/components/navbar";
import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineUserCircle, HiOutlineX } from "react-icons/hi";

export default function ProfileUI() {
  const [userInfo, setUserInfo] = useState();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectToAnalyzerPage, setRedirectToAnalyzerPage] = useState(false);

  const [userProfileData, setUserProfileData] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const isUserLogin = useUser((s) => s.isUserLogin);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    setIsSubmitting(true);
    const normalized = { ...data };
    setUserInfo(normalized);
    localStorage.setItem("userInfo", JSON.stringify(normalized));
    setTimeout(() => {
      setIsSubmitting(false);
      setRedirectToAnalyzerPage(true);
    }, 500);
  }

  function handleGetProfileData() {
    try {
      let authData = JSON.parse(localStorage.getItem("userInfo"));
      setUserProfileData(authData);
      setShowProfilePopup(true);
    } catch (error) {}
  }

  function handleClosePopup() {
    setShowProfilePopup(false);
  }

  useEffect(() => {
    try {
      let authData = JSON.parse(localStorage.getItem("auth-data"));
      if (authData?.isLogin) return;
      if (!authData?.isLogin) {
        router.push("/");
      }
    } catch (error) {
      alert(error);
    }
  }, []);

  useEffect(() => {
    if (!isSubmitting && redirectToAnalyzerPage) {
      const timer = setTimeout(() => {
        router.push("/jd-analyzer");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitting, redirectToAnalyzerPage, router]);

  return (
    <>
      <Navbar />

      {/* Top redirect loader */}
      {redirectToAnalyzerPage && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-gray-200 overflow-hidden">
            <div className="h-full bg-teal-600 animate-[loading_2s_linear]" />
          </div>
          <div className="text-center text-sm py-2 bg-white shadow">
            Redirecting to JD Analyzer…
          </div>
        </div>
      )}

      {/* Profile Data Popup Modal */}
      {showProfilePopup && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center
      bg-black/70 backdrop-blur-sm transition`}
        >
          <div
            className={`relative w-full max-w-md mx-4 rounded-2xl
        border border-white/10 bg-[#0b0614]
        shadow-2xl`}
          >
            {/* Close Button */}
            <button
              className={`absolute top-4 right-4 rounded-full p-1
          text-purple-300/70 hover:text-purple-200
          bg-white/5 hover:bg-white/10
          transition`}
              style={{ outline: "none", border: "none" }}
              onClick={handleClosePopup}
              aria-label="Close profile summary"
              tabIndex={0}
            >
              <HiOutlineX className={`cursor-pointer`} size={22} />
            </button>

            <div className={`p-7 pt-8`}>
              <h3
                className={`mb-5 text-lg font-semibold tracking-tight
            text-purple-100`}
              >
                Profile Summary
              </h3>

              {userProfileData ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4
              text-sm text-purple-100`}
                >
                  <div>
                    <p className={`text-xs mb-1 text-purple-300/60`}>Name</p>
                    <p className={`font-medium`}>{userProfileData?.fullName}</p>
                  </div>

                  <div>
                    <p className={`text-xs mb-1 text-purple-300/60`}>
                      Experience
                    </p>
                    <p className={`font-medium`}>{userProfileData?.exp}</p>
                  </div>

                  <div className={`sm:col-span-2`}>
                    <p className={`text-xs mb-1 text-purple-300/60`}>Skills</p>
                    <p className={`font-medium leading-relaxed`}>
                      {userProfileData?.skills}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs mb-1 text-purple-300/60`}>
                      Qualification
                    </p>
                    <p className={`font-medium`}>
                      {userProfileData?.qualification}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs mb-1 text-purple-300/60`}>
                      Work Authorization
                    </p>
                    <p className={`font-medium`}>
                      {userProfileData?.userWorkAuthorization}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs mb-1 text-purple-300/60`}>
                      Current Country
                    </p>
                    <p className={`font-medium`}>
                      {userProfileData?.currentCountry}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-xl border border-dashed border-white/10
              bg-white/5 p-6 text-center text-sm
              text-purple-300/70`}
                >
                  No user data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className={`min-h-screen py-12 px-6`}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(46,12,47,0.85) 0%, rgba(8,4,12,0.9) 40%, rgba(0,0,0,1) 100%)",
          color: "#EDE7FF",
        }}
      >
        <div className={`relative max-w-2xl mx-auto`}>
          <div
            className={`rounded-2xl p-8 shadow-lg `}
            style={{
              background:
                "linear-gradient(180deg, rgba(8,6,14,0.7), rgba(6,4,12,0.85))",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            {/* Header */}
            <div
              className={`flex items-start gap-4 mb-8 pb-6 border-b`}
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              {/* <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: colors.deepTeal,
          }}
          className={`flex items-center justify-center text-white font-bold text-2xl shadow-md`}
        >
          RF
        </div> */}
              <div className={`flex-1`}>
                <h1 className={`text-2xl font-bold mb-1`}>
                  Build your profile
                </h1>
                <p className={`text-sm text-gray-400`}>
                  Help us match you with the right opportunities
                </p>
              </div>
            </div>

            <button
              onClick={handleGetProfileData}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 mb-6 rounded-lg
    font-semibold border transition-all
    bg-white/5 text-purple-200
    hover:bg-purple-500/10 hover:border-purple-400/40`}
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                outline: "none",
              }}
            >
              <span className={`text-purple-300`}>
                <HiOutlineUserCircle size={20} />
              </span>
              See your profile summary
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6`}>
              <div>
                <label className={`block text-sm font-medium mb-2`}>
                  Full name <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <input
                  {...register("fullName", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  type="text"
                  placeholder="e.g. Tony Stark"
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent`}
                  style={{
                    borderColor: errors.fullName
                      ? "#B04434"
                      : "rgba(255,255,255,0.06)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    color: "#E6E6F0",
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = colors.deepTeal;
                    e.target.style.backgroundColor = "rgba(255,255,255,0.03)";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.02)";
                  }}
                />
                {errors.fullName && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1`}
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Tech stack */}
              <div>
                <label className={`block text-sm font-medium mb-2`}>
                  Top tech stack{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <div
                  className={`mb-3 flex flex-wrap items-center gap-2 rounded-lg
    border border-white/10 bg-white/5 px-4 py-3`}
                >
                  <span className={`text-xs text-purple-300/70`}>
                    Examples:
                  </span>

                  <span
                    className={`rounded-full bg-emerald-400/15 px-3 py-1.5
      text-xs font-medium text-emerald-300`}
                  >
                    React
                  </span>

                  <span
                    className={`rounded-full bg-orange-400/15 px-3 py-1.5
      text-xs font-medium text-orange-300`}
                  >
                    Next.js
                  </span>

                  <span
                    className={`rounded-full bg-pink-400/15 px-3 py-1.5
      text-xs font-medium text-pink-300`}
                  >
                    TypeScript
                  </span>
                </div>

                <input
                  {...register("skills", {
                    required: "Please add at least three skills",
                    minLength: {
                      value: 8,
                      message: "Skills must be at least 8 characters",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent`}
                  style={{
                    borderColor: errors.skills
                      ? "#B04434"
                      : "rgba(255,255,255,0.06)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    color: "#E6E6F0",
                  }}
                  placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                />
                {errors.skills && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1`}
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.skills.message}
                  </p>
                )}
                <p className={`text-xs text-gray-400 mt-2`}>
                  💡 Separate skills with commas for better matching
                </p>
              </div>

              {/* Years of experience */}
              <div>
                <label className={`block text-sm font-medium mb-2`}>
                  Years of experience{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <select
                  {...register("exp", {
                    required: "Please select your experience range",
                  })}
                  className={`w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer
    bg-white/5 text-purple-100
    focus:outline-none focus:ring-2 focus:ring-purple-500
    ${errors.exp ? "border-red-500" : "border-white/10 hover:border-white/20"}`}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1 years">0-1 years (Entry level)</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3-4 years">3-4 years</option>
                  <option value="5+ years">5+ years (Senior)</option>
                </select>

                {errors.exp && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1`}
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.exp.message}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2`}>
                  Highest Qualification{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>

                <input
                  {...register("qualification", {
                    required: "Highest qualification is required",
                    minLength: {
                      value: 3,
                      message: "Qualification must be at least 3 characters",
                    },
                  })}
                  type="text"
                  placeholder="e.g. Bachelor's in Computer Science"
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent`}
                  style={{
                    borderColor: errors.qualification
                      ? "#B04434"
                      : "rgba(255,255,255,0.06)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    color: "#E6E6F0",
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = colors.deepTeal;
                    e.target.style.backgroundColor = "rgba(255,255,255,0.03)";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.02)";
                  }}
                />

                {errors.qualification && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1`}
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.qualification.message}
                  </p>
                )}
              </div>

              {/* Work Authorization */}
              <div>
                <label className={`block text-sm font-medium mb-2`}>
                  Work authorization{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <select
                  {...register("userWorkAuthorization", {
                    required: "Please select your work authorization status",
                  })}
                  className={`w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer
    bg-white/5 text-purple-100
    focus:outline-none focus:ring-2 focus:ring-purple-500
    ${
      errors.userWorkAuthorization
        ? "border-red-500"
        : "border-white/10 hover:border-white/20"
    }`}
                >
                  <option value="">Select authorization status</option>
                  <option value="country-only">
                    Can work only in my country
                  </option>
                  <option value="us-work-auth">US work authorization</option>
                  <option value="uk-work-auth">UK work authorization</option>
                  <option value="eu-work-auth">EU work authorization</option>
                  <option value="need-sponsorship">Need sponsorship</option>
                  <option value="not-sure">Not sure</option>
                </select>

                {errors.userWorkAuthorization && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1`}
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.userWorkAuthorization.message}
                  </p>
                )}
              </div>

              {/* Current country */}
              <div>
                <label className={`block text-sm font-medium mb-2`}>
                  Current country{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <input
                  {...register("currentCountry", {
                    required: "Current country is required",
                  })}
                  type="text"
                  placeholder="e.g. India"
                  className={`w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent`}
                  style={{
                    borderColor: errors.currentCountry
                      ? "#B04434"
                      : "rgba(255,255,255,0.06)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    color: "#E6E6F0",
                  }}
                />
                {errors.currentCountry && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1`}
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.currentCountry.message}
                  </p>
                )}
              </div>

              {/* Willing to relocate */}
              <div
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-opacity-50`}
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <input
                  {...register("willingToRelocate")}
                  type="checkbox"
                  id="relocate"
                  className={`w-5 h-5 mt-0.5 rounded cursor-pointer`}
                  style={{ accentColor: colors.deepTeal }}
                />
                <label
                  htmlFor="relocate"
                  className={`text-sm cursor-pointer flex-1`}
                >
                  <span className={`font-medium`}>Willing to relocate</span>
                  <p className={`text-xs text-gray-400 mt-1`}>
                    Check this if you're open to moving for the right
                    opportunity
                  </p>
                </label>
              </div>

              <div className={`pt-4`}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all`}
                  style={{
                    background: "linear-gradient(90deg,#ec4899,#8b5cf6)",
                    boxShadow: "0 12px 40px rgba(139,92,246,0.22)",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Save profile →"}
                </button>
              </div>
            </form>

            <div
              className={`mt-6 p-4 rounded-lg flex items-start gap-3`}
              style={{
                background:
                  "linear-gradient(180deg, rgba(12,6,18,0.6), rgba(6,4,12,0.5))",
              }}
            >
              <span className={`text-lg`}>💡</span>
              <p className={`text-xs text-gray-400 leading-relaxed`}>
                Your profile helps us analyze job matches better. You can update
                these details anytime before analyzing a job description.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* animation */}
      <style jsx global>{`
        @keyframes loading {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </>
  );
}
