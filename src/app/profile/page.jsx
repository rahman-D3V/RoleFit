"use client";

import { colors } from "@/config/colors";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfileUI() {
  const [userInfo, setUserInfo] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    const normalized = {
      ...data,
    };

    console.log(normalized);
    setUserInfo(normalized);
    localStorage.setItem("userInfo", JSON.stringify(normalized));
  }

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{ background: colors.softIvory, color: colors.carbonGray }}
    >
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ background: "white", border: "1px solid rgba(0,0,0,0.02)" }}
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

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full name */}
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
                  borderColor: errors.fullName ? "#B04434" : "rgba(0,0,0,0.08)",
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
                Top tech stack <span style={{ color: colors.deepTeal }}>*</span>
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
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <input
                {...register("timeZone", {})}
                type="text"
                placeholder="e.g. Asia/Kolkata or GMT+5:30"
                className="w-full px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent"
                style={{
                  borderColor: errors.timeZone ? "#B04434" : "rgba(0,0,0,0.08)",
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
                  Check this if you're open to moving for the right opportunity
                </p>
              </label>
            </div>

            {/* Save button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: colors.deepTeal }}
              >
                Save profile →
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
  );
}
