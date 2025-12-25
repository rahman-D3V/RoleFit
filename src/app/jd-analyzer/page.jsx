"use client";

import { colors } from "@/config/colors";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineExclamation,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineUserCircle,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineClipboardCheck,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineXCircle,
  HiOutlineStar,
} from "react-icons/hi";
import {
  FaRegCheckCircle,
  FaRegStar,
  FaRegLightbulb,
  FaRegFileAlt,
  FaRegClipboard,
  FaExclamationTriangle,
  FaRegCircle,
  FaSyncAlt,
  FaRegQuestionCircle,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineInfo } from "react-icons/md";
import { handleAnalyze } from "@/lib/jd";

export default function AnalyzerPageUI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jdText, setJdText] = useState("");
  const router = useRouter();

  // Build prompt when component mounts or jdText changes
  const buildPrompt = (userData, jobDescription) => {
    return `Return ONLY raw JSON. Do NOT use code fences or any markdown. Output must be valid JSON only.

You are Matchify, an expert job-matching system.
Compare the given candidate profile with the Job Description (JD) and produce a concise, factual JSON analysis.

Core rules:
- Be realistic and reasonably strict. Base conclusions only on the provided info.
- If the JD is ambiguous, infer conservatively and flag uncertainty in confidence_level.
- Recommendations must be exactly one of: "APPLY", "CONSIDER", "REJECT".
- Include a short confidence label: "High", "Medium", or "Low".
- Be concise and avoid extra text; output only the JSON object described below.

Important experience rule (handle "X+ years" consistently):
- Parse numeric thresholds from phrases like "3+ years", "5 years", "at least 4 years".
- Let required = X (number).
- Let candidate = candidate's years (numeric).
- Decision logic:
  1. If candidate >= required → mark experience status Eligible.
  2. If candidate == required - 1 → mark experience status Possibly Eligible (borderline). In this case:
     - Explain it's one year short and list 1–2 factors that could close the gap (portfolio, direct tech match, ownership).
     - Set confidence to "Medium" unless strong overriding evidence exists.
  3. Else → mark experience status Not Eligible.
- Override rules (promote status to higher eligibility if any strong override applies):
  - Candidate shows direct, deep experience with core required tech (e.g., TypeScript, Next.js) and demonstrable projects.
  - Candidate lists significant project ownership or shipped product features relevant to JD.
  - JD explicitly states "years flexible", "open to candidates", or similar wording.
  - Company context suggests urgency or startups (mention if JD indicates this).
  When overridden, explain why and set confidence accordingly.

Location rules:
- Hard blockers: phrases like "must be located in", "must have work authorization", "no sponsorship" => Not Eligible for remote international candidate.
- Soft hints: currency (USD/GBP), timezone preferences, "US time overlap" => reduce eligibility/confidence; mark Possibly Eligible and explain.

Skills matching:
- Extract required skills from JD (required vs preferred). Match candidate skills (case-insensitive).
- strong_matches: intersection of candidate skills and explicitly required JD skills (cap to 3 items).
- potential_gaps: required JD skills not in candidate profile (top 1–3).
- irrelevant_skills: candidate skills not mentioned in JD.

Scoring / recommendation hints (for consistent outputs):
- Strong skill alignment + experience Eligible => "APPLY" (High confidence).
- Borderline experience but strong skills / evidence => "CONSIDER" (Medium).
- Missing core required skills or Not Eligible by location/experience => "REJECT" (High or Medium depending on ambiguity).

Input (replace these with your runtime values):
USER PROFILE
${JSON.stringify(userData, null, 2)}

JOB DESCRIPTION
${jobDescription}

Output EXACTLY this JSON shape (fill fields realistically):

{
  "job_analysis": {
    "job_title": "",
    "company": "",
    "is_remote": true,
    "final_verdict": "APPLY/CONSIDER/REJECT",
    "summary": "Short 1-2 line overall fit summary"
  },
  "detailed_comparison": {
    "strong_matches": {
      "explanation": "One-line explanation",
      "matches": []
    },
    "potential_gaps": {
      "explanation": "One-line explanation",
      "gaps": [],
      "addressability": "Minor/Moderate/Significant"
    },
    "irrelevant_skills": {
      "explanation": "",
      "skills": []
    }
  },
  "eligibility_check": {
    "location_analysis": {
      "status": "Eligible/Not Eligible/Possibly Eligible",
      "reason": ""
    },
    "experience_level": {
      "status": "Eligible/Not Eligible/Possibly Eligible",
      "reason": "",
      "required_experience": "parsed from JD (e.g. '3+ years')",
      "your_level": "candidate's years (e.g. '2-3 years' or numeric)"
    }
  },
  "final_recommendation": {
    "decision": "APPLY/CONSIDER/REJECT",
    "confidence_level": "High/Medium/Low",
    "primary_reason": "Single-sentence main reason",
    "suggested_next_steps": []
  }
}
`;
  };

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      alert("Please paste a job description first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const prompt = buildPrompt(userData, jdText);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze job description. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictConfig = (verdict) => {
    const configs = {
      APPLY: {
        color: colors.olive,
        bgLight: "rgba(107, 142, 35, 0.1)",
        icon: "✓",
        text: "Strong Match",
      },
      CONSIDER: {
        color: colors.amberClay,
        bgLight: "rgba(204, 119, 34, 0.1)",
        icon: "~",
        text: "Moderate Match",
      },
      REJECT: {
        color: colors.reddishBrown,
        bgLight: "rgba(165, 42, 42, 0.1)",
        icon: "✕",
        text: "Poor Match",
      },
    };
    return configs[verdict] || configs.REJECT;
  };

  const StatusBadge = ({ status }) => {
    const isPositive = status?.includes("Eligible") && !status?.includes("Not");
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
          isPositive ? "bg-opacity-10" : "bg-opacity-10"
        }`}
        style={{
          background: isPositive
            ? "rgba(107, 142, 35, 0.1)"
            : "rgba(165, 42, 42, 0.1)",
          color: isPositive ? colors.olive : colors.reddishBrown,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: isPositive ? colors.olive : colors.reddishBrown,
          }}
        />
        {status}
      </span>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-[#2d695f1a]">
        {/* Document icon */}
        <HiOutlineDocumentText
          className="w-10 h-10"
          style={{ color: colors.deepTeal }}
        />
      </div>

      <h3
        className="text-xl font-semibold mb-2"
        style={{ color: colors.carbonGray }}
      >
        No Analysis Yet
      </h3>
      <p className="text-center text-sm max-w-md mb-6 text-[#6c757d]">
        Paste a job description in the editor and click "Analyze Job Match" to
        see how well it matches your profile.
      </p>
    </div>
  );

  // Use optional chaining to avoid error when accessing nested properties:
  const verdictConfig = analysis?.job_analysis?.final_verdict
    ? getVerdictConfig(analysis?.job_analysis?.final_verdict)
    : null;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3  cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div
              className="flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.deepTeal} 0%, #1a5f5a 100%)`,
              }}
            >
              RF
            </div>
            <div>
              <div
                className="font-bold text-lg"
                style={{ color: colors.carbonGray }}
              >
                RoleFit
              </div>
              <div className="text-xs text-[#6c757d]">
                AI-Powered Job Match Analyzer
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-2.5 cursor-pointer text-sm font-medium rounded-lg transition-all bg-gray-100 hover:bg-gray-200"
            style={{ color: colors.carbonGray }}
          >
            Profile
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* LEFT: Analysis Results or Empty State */}
          <div>
            {!analysis?.job_analysis ? (
              <div className="rounded-2xl bg-white shadow-sm border border-[rgba(0,0,0,0.06)]">
                <EmptyState />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Hero Card - Verdict */}
                <div className="rounded-2xl p-6 bg-white shadow-sm border border-[rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-2 text-[#6c757d]">
                        Job Analysis Results
                      </div>
                      <h1
                        className="text-2xl font-bold mb-1"
                        style={{ color: colors.carbonGray }}
                      >
                        {analysis?.job_analysis?.job_title}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-[#6c757d]">
                        <span className="font-medium">
                          {analysis?.job_analysis?.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {analysis?.job_analysis?.is_remote ? (
                            <>
                              <HiOutlineLocationMarker className="w-4 h-4" />
                              Remote
                            </>
                          ) : (
                            "On-site"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div
                        className="px-4 py-2 rounded-xl font-bold text-black/70 text-sm flex items-center gap-2 shadow-sm"
                        style={{
                          background: verdictConfig?.color,
                        }}
                      >
                        <span className="text-lg text-gray-600">
                          {verdictConfig?.icon}
                        </span>
                        {analysis?.job_analysis?.final_verdict}
                      </div>
                      <div className="text-xs text-gray-600">
                        {verdictConfig?.text}
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl"
                    style={{ background: verdictConfig?.bgLight }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: colors.carbonGray }}
                    >
                      {analysis?.job_analysis?.summary}
                    </p>
                  </div>
                </div>

                {/* Skills Analysis Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strong Matches */}
                  <div className="rounded-2xl p-6 bg-white shadow-sm border border-[rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(107,142,35,0.1)]">
                        <FaRegCheckCircle className="w-5 h-5 text-[#18605f]" />
                      </div>
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: colors.carbonGray }}
                        >
                          Strong Matches
                        </h3>
                        <p className="text-xs text-[#6c757d]">
                          {analysis?.detailed_comparison?.strong_matches
                            ?.matches?.length ?? 0}{" "}
                          skills aligned
                        </p>
                      </div>
                    </div>

                    {analysis?.detailed_comparison?.strong_matches?.matches
                      ?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis?.detailed_comparison?.strong_matches?.matches?.map(
                          (skill, i) => (
                            <span
                              key={i}
                              className="px-3 text-black py-1.5 rounded-lg text-xs font-medium border"
                              style={{
                                background: "rgba(107, 142, 35, 0.1)",
                                border: `1px solid rgba(107, 142, 35, 0.2)`,
                              }}
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-[#6c757d]">
                        No strong matches identified.
                      </p>
                    )}
                  </div>

                  {/* Potential Gaps */}
                  <div className="rounded-2xl p-6 bg-white shadow-sm border border-[rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(255,152,0,0.1)]">
                        <FaExclamationTriangle
                          className="w-5 h-5"
                          style={{ color: "#ff9800" }}
                        />
                      </div>
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: colors.carbonGray }}
                        >
                          Skill Gaps
                        </h3>
                        <p className="text-xs text-[#6c757d]">
                          {
                            analysis?.detailed_comparison?.potential_gaps
                              ?.addressability
                          }{" "}
                          addressability
                        </p>
                      </div>
                    </div>

                    {analysis?.detailed_comparison?.potential_gaps?.gaps
                      ?.length > 0 ? (
                      <>
                        <ul className="space-y-2">
                          {analysis?.detailed_comparison?.potential_gaps?.gaps
                            ?.slice(0, 3)
                            .map((gap, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm"
                                style={{ color: colors.carbonGray }}
                              >
                                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-[#ff9800]" />
                                <span className="leading-relaxed">{gap}</span>
                              </li>
                            ))}
                        </ul>
                        {analysis?.detailed_comparison?.potential_gaps?.gaps
                          ?.length > 3 && (
                          <button
                            className="mt-3 text-xs font-medium"
                            style={{ color: colors.deepTeal }}
                          >
                            +{" "}
                            {analysis?.detailed_comparison?.potential_gaps?.gaps
                              ?.length - 3}{" "}
                            more gaps
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-[#6c757d]">
                        No notable gaps found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Eligibility Checks */}
                <div className="rounded-2xl p-6 bg-white shadow-sm border border-[rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-md">
                  <h3
                    className="font-semibold text-lg mb-4"
                    style={{ color: colors.carbonGray }}
                  >
                    Eligibility Assessment
                  </h3>

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="p-4 rounded-xl bg-[#f8f9fa]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <HiOutlineLocationMarker
                            className="w-5 h-5"
                            style={{ color: "#6c757d" }}
                          />
                          <span
                            className="font-medium text-sm"
                            style={{ color: colors.carbonGray }}
                          >
                            Location & Remote Work
                          </span>
                        </div>
                        <div className="text-black">
                          <StatusBadge
                            status={
                              analysis?.eligibility_check?.location_analysis
                                ?.status
                            }
                          />
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-[#6c757d]">
                        {analysis?.eligibility_check?.location_analysis?.reason}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="p-4 rounded-xl bg-[#f8f9fa]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <HiOutlineBriefcase
                            className="w-5 h-5"
                            style={{ color: "#6c757d" }}
                          />
                          <span
                            className="font-medium text-sm"
                            style={{ color: colors.carbonGray }}
                          >
                            Experience Level
                          </span>
                        </div>
                        <div className="text-black">
                          <StatusBadge
                            status={
                              analysis?.eligibility_check?.experience_level
                                ?.status
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white">
                          <div className="text-xs mb-1 text-[#6c757d]">
                            Required
                          </div>
                          <div
                            className="text-xs font-medium"
                            style={{ color: colors.carbonGray }}
                          >
                            {
                              analysis?.eligibility_check?.experience_level
                                ?.required_experience
                            }
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white">
                          <div className="text-xs mb-1 text-[#6c757d]">
                            Your Level
                          </div>
                          <div
                            className="text-xs font-medium"
                            style={{ color: colors.carbonGray }}
                          >
                            {
                              analysis?.eligibility_check?.experience_level
                                ?.your_level
                            }
                          </div>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-[#6c757d]">
                        {analysis?.eligibility_check?.experience_level?.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Recommendation */}
                <div className="rounded-2xl p-6 bg-white shadow-sm border border-[rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(74,85,104,0.1)]">
                      <HiOutlineLightBulb
                        className="w-5 h-5"
                        style={{ color: "#4a5568" }}
                      />
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        style={{ color: colors.carbonGray }}
                      >
                        Recommended Next Steps
                      </h3>
                      <p className="text-xs text-[#6c757d]">
                        Confidence:{" "}
                        {analysis?.final_recommendation?.confidence_level}
                      </p>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl mb-4"
                    style={{ background: verdictConfig?.bgLight }}
                  >
                    <p
                      className="text-sm font-medium leading-relaxed"
                      style={{ color: colors.carbonGray }}
                    >
                      {analysis?.final_recommendation?.primary_reason}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {analysis?.final_recommendation?.suggested_next_steps?.map(
                      (step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50 bg-[#f8f9fa]"
                        >
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: colors.deepTeal,
                              color: "white",
                            }}
                          >
                            {i + 1}
                          </span>
                          <p
                            className="text-sm leading-relaxed pt-0.5"
                            style={{ color: colors.carbonGray }}
                          >
                            {step}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Job Description Input */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="rounded-2xl p-6 bg-white shadow-sm border border-[rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineDocumentText
                  className="w-5 h-5"
                  style={{ color: colors.deepTeal }}
                />
                <h3
                  className="font-semibold"
                  style={{ color: colors.carbonGray }}
                >
                  Job Description
                </h3>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.carbonGray }}
                  >
                    Paste job posting details
                  </label>
                  <textarea
                    name="jdTextarea"
                    rows={16}
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full text-black p-4 rounded-xl border resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 transition-all border-[rgba(0,0,0,0.06)] bg-[#f8f9fa]"
                    placeholder="Paste the complete job description here..."
                  />
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: `linear-gradient(135deg, ${colors.deepTeal} 0%, #1a5f5a 100%)`,
                  }}
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jdText.trim()}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin h-4 w-4" />
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Job Match"
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50 border-[rgba(0,0,0,0.06)]"
                    style={{
                      color: colors.carbonGray,
                    }}
                    onClick={() => {
                      setJdText("");
                      setAnalysis(null);
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <div className="pt-3 border-t border-[rgba(0,0,0,0.06)]">
                  <div className="flex items-start gap-2 text-xs text-[#6c757d]">
                    <FaRegQuestionCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Your data is processed securely and never stored. The AI
                      analyzes job requirements against your profile.
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Irrelevant Skills */}
            {analysis?.detailed_comparison?.irrelevant_skills?.skills?.length >
              0 && (
              <div className="mt-6 rounded-2xl p-4 bg-white shadow-sm border border-[rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineExclamationCircle
                    className="w-4 h-4"
                    style={{ color: "#6c757d" }}
                  />
                  <h4
                    className="text-sm font-medium"
                    style={{ color: colors.carbonGray }}
                  >
                    Irrelevant Skills
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis?.detailed_comparison?.irrelevant_skills?.skills?.map(
                    (skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs border"
                        style={{
                          background: "rgba(0,0,0,0.03)",
                          color: "#6c757d",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
