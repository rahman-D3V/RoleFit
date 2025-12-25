"use client";

import Navbar from "@/components/navbar";
import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
 import {HiOutlineUserCircle} from 'react-icons/hi'

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition">
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 w-full max-w-md mx-4"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.02)",
            }}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition rounded-full p-1 bg-gray-50 shadow-md"
              style={{ outline: "none", border: "none" }}
              onClick={handleClosePopup}
              aria-label="Close profile summary"
              tabIndex={0}
            >
              <svg
                width={22}
                height={22}
                viewBox="0 0 22 22"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: "block" }}
              >
                <line x1="6" y1="6" x2="16" y2="16" />
                <line x1="16" y1="6" x2="6" y2="16" />
              </svg>
            </button>
            <div className="p-7 pt-8">
              <h3 className="mb-5 text-lg font-bold text-gray-800 tracking-tight">
                Profile Summary
              </h3>
              {userProfileData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Name</p>
                    <p className="font-medium">{userProfileData?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Experience</p>
                    <p className="font-medium">{userProfileData?.exp}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-500 text-xs mb-1">Skills</p>
                    <p className="font-medium leading-relaxed">
                      {userProfileData?.skills}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Qualification</p>
                    <p className="font-medium">
                      {userProfileData?.qualification}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">
                      Work Authorization
                    </p>
                    <p className="font-medium">
                      {userProfileData?.userWorkAuthorization}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">
                      Current Country
                    </p>
                    <p className="font-medium">
                      {userProfileData?.currentCountry}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
                  No user data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div
        className="min-h-screen py-12 px-6"
        style={{ background: colors.softIvory, color: colors.carbonGray }}
      >
        <div className="relative max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{
              background: "white",
              border: "1px solid rgba(0,0,0,0.02)",
            }}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  background: colors.deepTeal,
                }}
                className="flex items-center justify-center text-white font-bold text-2xl shadow-md"
              >
                M
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">Build your profile</h1>
                <p className="text-sm text-gray-500">
                  Help us match you with the right opportunities
                </p>
              </div>
            </div>

            <button
              onClick={handleGetProfileData}
              className="flex items-center gap-2 px-4 py-2 mb-6 rounded-lg font-semibold bg-white border border-gray-200 shadow transition hover:bg-gray-100 hover:shadow-md text-gray-800"
              style={{
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.03)",
                outline: "none",
                borderColor: colors.deepTeal,
              }}
            >
              <span className="text-teal-600">
                {/* Using HiOutlineUserCircle from react-icons/hi as a profile/user icon */}
                <HiOutlineUserCircle size={20} />
              </span>
              See your profile summary
            </button>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* ---- your entire form remains unchanged ---- */}

              <div>
                <label className="block text-sm font-medium mb-2">
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
                  placeholder="e.g. Yasir Khan"
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.fullName
                      ? "#B04434"
                      : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = colors.deepTeal;
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = colors.softIvory;
                  }}
                />
                {errors.fullName && (
                  <p
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Tech stack */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Top tech stack{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <div
                  className="mb-3 flex gap-2 items-center flex-wrap p-4 rounded-lg"
                  style={{ background: colors.softIvory }}
                >
                  <span className="text-xs text-gray-500">Examples:</span>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: colors.mintMist,
                      color: colors.deepTeal,
                    }}
                  >
                    React
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: colors.peachCream,
                      color: colors.deepTeal,
                    }}
                  >
                    Next.js
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: colors.roseSoft,
                      color: colors.deepTeal,
                    }}
                  >
                    TypeScript
                  </div>
                </div>
                <input
                  {...register("skills", {
                    required: "Please add at least three skills",
                    minLength: {
                      value: 8,
                      message: "Skills must be at least 8 characters",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.skills ? "#B04434" : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                  }}
                  placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                />
                {errors.skills && (
                  <p
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.skills.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  💡 Separate skills with commas for better matching
                </p>
              </div>

              {/* Years of experience */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Years of experience{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <select
                  {...register("exp", {
                    required: "Please select your experience range",
                  })}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent appearance-none cursor-pointer"
                  style={{
                    borderColor: errors.exp ? "#B04434" : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
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
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.exp.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.qualification
                      ? "#B04434"
                      : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                  }}
                  onFocus={(e) => {
                    e.target.style.ringColor = colors.deepTeal;
                    e.target.style.backgroundColor = "white";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = colors.softIvory;
                  }}
                />

                {errors.qualification && (
                  <p
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.qualification.message}
                  </p>
                )}
              </div>

              {/* Work Authorization */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Work authorization{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <select
                  {...register("userWorkAuthorization", {
                    required: "Please select your work authorization status",
                  })}
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent appearance-none cursor-pointer"
                  style={{
                    borderColor: errors.userWorkAuthorization
                      ? "#B04434"
                      : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                  }}
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
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.userWorkAuthorization.message}
                  </p>
                )}
              </div>

              {/* Current country */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current country{" "}
                  <span style={{ color: colors.deepTeal }}>*</span>
                </label>
                <input
                  {...register("currentCountry", {
                    required: "Current country is required",
                  })}
                  type="text"
                  placeholder="e.g. India"
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.currentCountry
                      ? "#B04434"
                      : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                  }}
                />
                {errors.currentCountry && (
                  <p
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.currentCountry.message}
                  </p>
                )}
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Timezone
                </label>
                <input
                  {...register("timeZone", {})}
                  type="text"
                  placeholder="e.g. Asia/Kolkata or GMT+5:30"
                  className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    borderColor: errors.timeZone
                      ? "#B04434"
                      : "rgba(0,0,0,0.08)",
                    backgroundColor: colors.softIvory,
                  }}
                />
                {errors.timeZone && (
                  <p
                    className="text-xs mt-2 flex items-center gap-1"
                    style={{ color: "#B04434" }}
                  >
                    <span>⚠</span> {errors.timeZone.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Optional but helps with remote jobs
                </p>
              </div>

              {/* Willing to relocate */}
              <div
                className="flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-opacity-50"
                style={{
                  borderColor: "rgba(0,0,0,0.08)",
                  background: colors.softIvory,
                }}
              >
                <input
                  {...register("willingToRelocate")}
                  type="checkbox"
                  id="relocate"
                  className="w-5 h-5 mt-0.5 rounded cursor-pointer"
                  style={{ accentColor: colors.deepTeal }}
                />
                <label
                  htmlFor="relocate"
                  className="text-sm cursor-pointer flex-1"
                >
                  <span className="font-medium">Willing to relocate</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Check this if you're open to moving for the right
                    opportunity
                  </p>
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all"
                  style={{ background: colors.deepTeal }}
                >
                  {isSubmitting ? "Submitting..." : "Save profile →"}
                </button>
              </div>
            </form>

            <div
              className="mt-6 p-4 rounded-lg flex items-start gap-3"
              style={{ background: colors.mintMist }}
            >
              <span className="text-lg">💡</span>
              <p className="text-xs text-gray-600 leading-relaxed">
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
