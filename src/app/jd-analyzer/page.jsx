"use client";

import { colors } from "@/config/colors";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AnalyzerPageUI() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jdText, setJdText] = useState("");

  const router = useRouter()

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
    const isPositive = status.includes("Eligible") && !status.includes("Not");
    return (
      <span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: isPositive ? "rgba(107, 142, 35, 0.1)" : "rgba(165, 42, 42, 0.1)",
          color: isPositive ? colors.olive : colors.reddishBrown,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: isPositive ? colors.olive : colors.reddishBrown }}
        />
        {status}
      </span>
    );
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "rgba(45, 105, 95, 0.1)" }}
      >
        <svg
          className="w-10 h-10"
          style={{ color: colors.deepTeal }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-2" style={{ color: colors.carbonGray }}>
        No Analysis Yet
      </h3>
      <p className="text-center text-sm max-w-md mb-6" style={{ color: "#6c757d" }}>
        Paste a job description in the editor and click "Analyze Job Match" to see how well it
        matches your profile.
      </p>

      <div className="flex items-center gap-2 text-xs" style={{ color: "#6c757d" }}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>Try the "Load Sample" button to see an example</span>
      </div>
    </div>
  );

  const verdictConfig = analysis ? getVerdictConfig(analysis.job_analysis.final_verdict) : null;

  useEffect(() => {
      try {
        let authData = JSON.parse(localStorage.getItem("auth-data"));
        if(authData?.isLogin) return;
        if (!authData?.isLogin) {
        router.push("/");
      }
      } catch (error) {
        alert(error);
      }
      
    }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)" }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center text-white font-bold text-lg"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${colors.deepTeal} 0%, #1a5f5a 100%)`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              M
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: colors.carbonGray }}>
                Matchify
              </div>
              <div className="text-xs" style={{ color: "#6c757d" }}>
                AI-Powered Job Match Analyzer
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs" style={{ color: "#6c757d" }}>
            <kbd className="px-2 py-1 rounded bg-gray-100 border" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-2 py-1 rounded bg-gray-100 border" style={{ borderColor: "rgba(0,0,0,0.1)" }}>
              Enter
            </kbd>
            <span className="ml-1">to analyze</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* LEFT: Analysis Results or Empty State */}
          <div>
            {!analysis ? (
              <div className="rounded-2xl bg-white shadow-sm border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <EmptyState />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Hero Card - Verdict */}
                <div
                  className="rounded-2xl p-6 bg-white shadow-sm border transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-2" style={{ color: "#6c757d" }}>
                        Job Analysis Results
                      </div>
                      <h1 className="text-2xl font-bold mb-1" style={{ color: colors.carbonGray }}>
                        {analysis.job_analysis.job_title}
                      </h1>
                      <div className="flex items-center gap-3 text-sm" style={{ color: "#6c757d" }}>
                        <span className="font-medium">{analysis.job_analysis.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {analysis.job_analysis.is_remote ? (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
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
                        className="px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm"
                        style={{ background: verdictConfig.color, color: "white" }}
                      >
                        <span className="text-lg">{verdictConfig.icon}</span>
                        {analysis.job_analysis.final_verdict}
                      </div>
                      <div className="text-xs" style={{ color: "#6c757d" }}>
                        {verdictConfig.text}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ background: verdictConfig.bgLight }}>
                    <p className="text-sm leading-relaxed" style={{ color: colors.carbonGray }}>
                      {analysis.job_analysis.summary}
                    </p>
                  </div>
                </div>

                {/* Skills Analysis Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strong Matches */}
                  <div
                    className="rounded-2xl p-6 bg-white shadow-sm border transition-all duration-300 hover:shadow-md"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(107, 142, 35, 0.1)" }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: colors.olive }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: colors.carbonGray }}>
                          Strong Matches
                        </h3>
                        <p className="text-xs" style={{ color: "#6c757d" }}>
                          {analysis.detailed_comparison.strong_matches.matches.length} skills aligned
                        </p>
                      </div>
                    </div>

                    {analysis.detailed_comparison.strong_matches.matches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {analysis.detailed_comparison.strong_matches.matches.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              background: "rgba(107, 142, 35, 0.1)",
                              color: colors.olive,
                              border: `1px solid rgba(107, 142, 35, 0.2)`,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "#6c757d" }}>
                        No strong matches identified.
                      </p>
                    )}
                  </div>

                  {/* Potential Gaps */}
                  <div
                    className="rounded-2xl p-6 bg-white shadow-sm border transition-all duration-300 hover:shadow-md"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(255, 152, 0, 0.1)" }}
                      >
                        <svg
                          className="w-5 h-5"
                          style={{ color: "#ff9800" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold" style={{ color: colors.carbonGray }}>
                          Skill Gaps
                        </h3>
                        <p className="text-xs" style={{ color: "#6c757d" }}>
                          {analysis.detailed_comparison.potential_gaps.addressability} addressability
                        </p>
                      </div>
                    </div>

                    {analysis.detailed_comparison.potential_gaps.gaps.length > 0 ? (
                      <>
                        <ul className="space-y-2">
                          {analysis.detailed_comparison.potential_gaps.gaps.slice(0, 3).map((gap, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: colors.carbonGray }}>
                              <span
                                className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                                style={{ background: "#ff9800" }}
                              />
                              <span className="leading-relaxed">{gap}</span>
                            </li>
                          ))}
                        </ul>
                        {analysis.detailed_comparison.potential_gaps.gaps.length > 3 && (
                          <button className="mt-3 text-xs font-medium" style={{ color: colors.deepTeal }}>
                            + {analysis.detailed_comparison.potential_gaps.gaps.length - 3} more gaps
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm" style={{ color: "#6c757d" }}>
                        No notable gaps found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Eligibility Checks */}
                <div
                  className="rounded-2xl p-6 bg-white shadow-sm border transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <h3 className="font-semibold text-lg mb-4" style={{ color: colors.carbonGray }}>
                    Eligibility Assessment
                  </h3>

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="p-4 rounded-xl" style={{ background: "#f8f9fa" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" style={{ color: "#6c757d" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium text-sm" style={{ color: colors.carbonGray }}>
                            Location & Remote Work
                          </span>
                        </div>
                        <StatusBadge status={analysis.eligibility_check.location_analysis.status} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#6c757d" }}>
                        {analysis.eligibility_check.location_analysis.reason}
                      </p>
                    </div>

                    {/* Experience */}
                    <div className="p-4 rounded-xl" style={{ background: "#f8f9fa" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5" style={{ color: "#6c757d" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium text-sm" style={{ color: colors.carbonGray }}>
                            Experience Level
                          </span>
                        </div>
                        <StatusBadge status={analysis.eligibility_check.experience_level.status} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white">
                          <div className="text-xs mb-1" style={{ color: "#6c757d" }}>
                            Required
                          </div>
                          <div className="text-xs font-medium" style={{ color: colors.carbonGray }}>
                            {analysis.eligibility_check.experience_level.required_experience}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white">
                          <div className="text-xs mb-1" style={{ color: "#6c757d" }}>
                            Your Level
                          </div>
                          <div className="text-xs font-medium" style={{ color: colors.carbonGray }}>
                            {analysis.eligibility_check.experience_level.your_level}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed" style={{ color: "#6c757d" }}>
                        {analysis.eligibility_check.experience_level.reason}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Recommendation */}
                <div
                  className="rounded-2xl p-6 bg-white shadow-sm border transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(74, 85, 104, 0.1)" }}
                    >
                      <svg className="w-5 h-5" style={{ color: "#4a5568" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: colors.carbonGray }}>
                        Recommended Next Steps
                      </h3>
                      <p className="text-xs" style={{ color: "#6c757d" }}>
                        Confidence: {analysis.final_recommendation.confidence_level}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl mb-4" style={{ background: verdictConfig.bgLight }}>
                    <p className="text-sm font-medium leading-relaxed" style={{ color: colors.carbonGray }}>
                      {analysis.final_recommendation.primary_reason}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {analysis.final_recommendation.suggested_next_steps.map((step, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-gray-50"
                        style={{ background: "#f8f9fa" }}
                      >
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: colors.deepTeal, color: "white" }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed pt-0.5" style={{ color: colors.carbonGray }}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Job Description Input */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div
              className="rounded-2xl p-6 bg-white shadow-sm border transition-all duration-300 hover:shadow-md"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" style={{ color: colors.deepTeal }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="font-semibold" style={{ color: colors.carbonGray }}>
                  Job Description
                </h3>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.carbonGray }}>
                    Paste job posting details
                  </label>
                  <textarea
                    name="jdTextarea"
                    rows={16}
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full p-4 rounded-xl border resize-none text-sm leading-relaxed focus:outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: "rgba(0,0,0,0.06)",
                      backgroundColor: "#f8f9fa",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.deepTeal;
                      e.target.style.backgroundColor = "white";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(0,0,0,0.06)";
                      e.target.style.backgroundColor = "#f8f9fa";
                    }}
                    placeholder="Paste the complete job description here...

Example:
• Job title and company
• Required experience level
• Technical skills & tools
• Location or remote policy
• Responsibilities
• Qualifications"
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
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Job Match"
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50"
                    style={{ borderColor: "rgba(0,0,0,0.06)", color: colors.carbonGray }}
                    onClick={() => {
                      const sample = `Senior Frontend Engineer @ TechCorp

Location: Remote (US timezone preferred)
Experience: 5+ years

Required Skills:
• React, Next.js (SSR, SSG, API routes)
• TypeScript
• State management (Redux/Zustand/React Query)
• Styled Components / Tailwind CSS
• RESTful APIs & GraphQL

Qualifications:
• Strong portfolio demonstrating UI/UX skills
• Excellent communication skills
• Experience in fast-paced startup environment

Salary: $80k-$120k + equity`;
                      setJdText(sample);
                    }}
                  >
                    Load Sample
                  </button>

                  <button
                    type="button"
                    className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50"
                    style={{ borderColor: "rgba(0,0,0,0.06)", color: colors.carbonGray }}
                    onClick={() => {
                      setJdText("");
                      setAnalysis(null);
                    }}
                  >
                    Clear All
                  </button>
                </div>

                <div className="pt-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <div className="flex items-start gap-2 text-xs" style={{ color: "#6c757d" }}>
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="leading-relaxed">
                      Your data is processed securely and never stored. The AI analyzes job requirements against your
                      profile.
                    </span>
                  </div>
                </div>
              </form>
            </div>

            {/* Irrelevant Skills */}
            {analysis && analysis.detailed_comparison.irrelevant_skills.skills.length > 0 && (
              <div className="mt-6 rounded-2xl p-4 bg-white shadow-sm border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4" style={{ color: "#6c757d" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h4 className="text-sm font-medium" style={{ color: colors.carbonGray }}>
                    Irrelevant Skills
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.detailed_comparison.irrelevant_skills.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs"
                      style={{
                        background: "rgba(0,0,0,0.03)",
                        color: "#6c757d",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
