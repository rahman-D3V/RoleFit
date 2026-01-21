"use client";

import { colors } from "@/config/colors";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineExclamationCircle,
  HiOutlineLightBulb,
} from "react-icons/hi";
import {
  FaRegCheckCircle,
  FaExclamationTriangle,
  FaRegQuestionCircle,
  FaSpinner,
} from "react-icons/fa";

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
      const raw = localStorage.getItem("auth-data");
      const authData = raw ? JSON.parse(raw) : null;
      if (authData?.isLogin) return;
      if (!authData?.isLogin) {
        router.push("/");
      }
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#07000f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#07000f]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
          font-bold text-lg text-white
          bg-gradient-to-br from-purple-500 to-indigo-500
          shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
              RF
            </div>
            <div>
              <div className="font-semibold text-lg">RoleFit</div>
              <div className="text-xs text-purple-200/60">
                AI Job Match Analyzer
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="px-6 py-2.5 rounded-lg text-sm font-medium
        bg-white/5 border border-white/10
        text-purple-200 hover:text-white hover:bg-white/10 transition"
          >
            Profile
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          {/* LEFT */}
          <div>
            {!analysis?.job_analysis ? (
              <div className="rounded-2xl bg-white/5 border border-white/10">
                <EmptyState />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Verdict */}
                <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between gap-6 mb-5">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide text-purple-200/50 mb-2">
                        Job Analysis Result
                      </div>
                      <h1 className="text-2xl font-semibold mb-1">
                        {analysis?.job_analysis?.job_title}
                      </h1>
                      <div className="flex items-center gap-3 text-sm text-purple-200/60">
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
                        className="px-4 py-2 rounded-xl text-sm font-semibold
                    border border-white/10"
                        style={{ background: verdictConfig?.color }}
                      >
                        {verdictConfig?.icon}{" "}
                        {analysis?.job_analysis?.final_verdict}
                      </div>
                      <div className="text-xs text-purple-200/60">
                        {verdictConfig?.text}
                      </div>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl border border-white/10"
                    style={{ background: verdictConfig?.bgLight }}
                  >
                    <p className="text-sm leading-relaxed text-white/90">
                      {analysis?.job_analysis?.summary}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strong matches */}
                  <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <FaRegCheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <h3 className="font-semibold">Strong Matches</h3>
                        <p className="text-xs text-purple-200/60">
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
                              className="px-3 py-1.5 rounded-lg text-xs
                          bg-green-500/10 text-green-300 border border-green-500/20"
                            >
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-purple-200/60">
                        No strong matches identified.
                      </p>
                    )}
                  </div>

                  {/* Gaps */}
                  <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <FaExclamationTriangle className="w-5 h-5 text-amber-400" />
                      <div>
                        <h3 className="font-semibold">Skill Gaps</h3>
                        <p className="text-xs text-purple-200/60">
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
                                className="flex items-start gap-2 text-sm text-white/90"
                              >
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400" />
                                {gap}
                              </li>
                            ))}
                        </ul>
                        {analysis?.detailed_comparison?.potential_gaps?.gaps
                          ?.length > 3 && (
                          <button className="mt-3 text-xs text-purple-400 hover:underline">
                            +{" "}
                            {analysis?.detailed_comparison?.potential_gaps?.gaps
                              ?.length - 3}{" "}
                            more gaps
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-purple-200/60">
                        No notable gaps found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Eligibility */}
                <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-lg mb-5">
                    Eligibility Assessment
                  </h3>

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <HiOutlineLocationMarker className="w-5 h-5 text-purple-300" />
                          <span className="text-sm font-medium">
                            Location & Remote Work
                          </span>
                        </div>
                        <StatusBadge
                          status={
                            analysis?.eligibility_check?.location_analysis
                              ?.status
                          }
                        />
                      </div>
                      <p className="text-sm text-purple-200/70">
                        {analysis?.eligibility_check?.location_analysis?.reason}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <HiOutlineBriefcase className="w-5 h-5 text-purple-300" />
                          <span className="text-sm font-medium">
                            Experience Level
                          </span>
                        </div>
                        <StatusBadge
                          status={
                            analysis?.eligibility_check?.experience_level
                              ?.status
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                          <div className="text-xs text-purple-200/60 mb-1">
                            Required
                          </div>
                          <div className="text-xs font-medium">
                            {
                              analysis?.eligibility_check?.experience_level
                                ?.required_experience
                            }
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                          <div className="text-xs text-purple-200/60 mb-1">
                            Your Level
                          </div>
                          <div className="text-xs font-medium">
                            {
                              analysis?.eligibility_check?.experience_level
                                ?.your_level
                            }
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-purple-200/70">
                        {analysis?.eligibility_check?.experience_level?.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <HiOutlineLightBulb className="w-5 h-5 text-purple-300" />
                    <div>
                      <h3 className="font-semibold">Recommended Next Steps</h3>
                      <p className="text-xs text-purple-200/60">
                        Confidence:{" "}
                        {analysis?.final_recommendation?.confidence_level}
                      </p>
                    </div>
                  </div>

                  <div
                    className="p-4 rounded-xl mb-4 border border-white/10"
                    style={{ background: verdictConfig?.bgLight }}
                  >
                    <p className="text-sm font-medium">
                      {analysis?.final_recommendation?.primary_reason}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {analysis?.final_recommendation?.suggested_next_steps?.map(
                      (step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg
                      bg-black/30 border border-white/10"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center
                        text-xs font-bold bg-purple-500 text-white"
                          >
                            {i + 1}
                          </span>
                          <p className="text-sm text-purple-200/80">{step}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6">
            <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineDocumentText className="w-5 h-5 text-purple-300" />
                <h3 className="font-semibold">Job Description</h3>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <textarea
                  rows={16}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full p-4 rounded-xl resize-none text-sm
              bg-black/30 border border-white/10
              text-white placeholder-purple-200/40
              focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Paste the complete job description here..."
                />

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jdText.trim()}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-purple-500 to-indigo-500
              hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]
              disabled:opacity-50 transition"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin h-4 w-4" />
                      Analyzing…
                    </span>
                  ) : (
                    "Analyze Job Match"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJdText("");
                    setAnalysis(null);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm
              bg-white/5 border border-white/10
              hover:bg-white/10 transition"
                >
                  Clear All
                </button>

                <div className="pt-3 border-t border-white/10 text-xs text-purple-200/60 flex gap-2">
                  <FaRegQuestionCircle className="w-4 h-4 mt-0.5" />
                  <span>Your data is processed securely and never stored.</span>
                </div>
              </form>
            </div>

            {/* Irrelevant skills */}
            {analysis?.detailed_comparison?.irrelevant_skills?.skills?.length >
              0 && (
              <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineExclamationCircle className="w-4 h-4 text-purple-300" />
                  <h4 className="text-sm font-medium">Irrelevant Skills</h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysis?.detailed_comparison?.irrelevant_skills?.skills?.map(
                    (skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs
                    bg-black/30 border border-white/10
                    text-purple-200/70"
                      >
                        {skill}
                      </span>
                    ),
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
