"use client";
import Navbar from "@/components/navbar";
import { colors } from "@/config/colors";
import { useUser } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const MatchifyLanding = () => {
  const router = useRouter();
  const isUserLogin = useUser((s) => s.isUserLogin);
  const setIsUserLogin = useUser((s) => s.setIsUserLogin);

  const [localAuthData, setLocalAuthData] = useState(null);

  const videoRef = useRef();

  function handleLogout() {
    try {
      let authData = JSON.parse(localStorage.getItem("auth-data"));
      authData = { ...authData, isLogin: false };
      localStorage.setItem("auth-data", JSON.stringify(authData));
    } catch (error) {
      alert(error);
    }
  }

  function handleStartFree() {
    try {
      let authData = JSON.parse(localStorage.getItem("auth-data"));
      if (authData?.isLogin) {
        router.push("/jd-analyzer");
      } else {
        router.push("/login");
      }
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    try {
      let authData = JSON.parse(localStorage.getItem("auth-data"));
      if (authData) {
        setIsUserLogin(authData?.isLogin);
        setLocalAuthData(authData);
      }
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <div
      className="min-h-screen  font-sans antialiased"
      style={{ backgroundColor: colors.softIvory }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden bg-[#090012] px-6 flex items-center justify-center">
        {/* Ambient glow */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full 
      bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25),transparent_60%)] blur-3xl"
          />
        </div>

        {/* Radial arc */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-purple-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full border border-purple-400/10" />

        <div className="relative z-10 text-center max-w-4xl">
          {isUserLogin && (
            <div
              className="inline-flex mb-6 px-4 py-1.5 rounded-full text-xs font-medium
        bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              Welcome back, {localAuthData?.userName}
            </div>
          )}

          <h1 className="text-5xl lg:text-6xl font-semibold text-white tracking-tight">
            Know your chances <br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
              before you apply
            </span>
          </h1>

          <p className="mt-6 text-lg text-purple-200/70 max-w-2xl mx-auto">
            Analyze any job description instantly. See match score, skill gaps,
            and culture alignment before you hit apply.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={handleStartFree}
              className="px-8 py-4 rounded-full font-medium text-white
        bg-gradient-to-r from-purple-500 to-indigo-500
        shadow-[0_0_40px_rgba(168,85,247,0.45)]
        hover:shadow-[0_0_60px_rgba(168,85,247,0.7)]
        transition"
            >
              Start Free Analysis
            </button>
          </div>
        </div>

        {/* Floating card */}
        <div className="absolute bottom-[-120px] w-full flex justify-center z-20">
          <div
            className="w-[360px] rounded-3xl p-6
      bg-gradient-to-b from-white/10 to-white/5
      backdrop-blur-xl border border-purple-500/20
      shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex justify-between mb-4 text-sm text-purple-200">
              <span>Match Score</span>
              <span className="text-white font-semibold">87%</span>
            </div>

            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-2 w-[87%] bg-gradient-to-r from-purple-400 to-indigo-400" />
            </div>

            <div className="mt-5 text-center text-xs text-purple-300 bg-purple-500/10 py-2 rounded-lg border border-purple-500/20">
              Strong Match • High Confidence
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-24 px-6"
        style={{ backgroundColor: colors.softIvory }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: colors.carbonGray }}
            >
              Why RoleFit works
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: colors.carbonGray, opacity: 0.7 }}
            >
              Stop applying blindly. Start applying strategically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="group relative overflow-hidden p-10 rounded-3xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer border border-orange-300"
              style={{ backgroundColor: colors.peachCream }}
              onMouseEnter={() => videoRef.current?.play()}
              onMouseLeave={() => {
                videoRef.current?.pause();
                videoRef.current.currentTime = 0;
              }}
            >
              {/* Video */}
              <video
                ref={videoRef}
                src="/AI.mp4"
                muted
                playsInline
                className="absolute inset-0 z-20 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-5xl mb-5">🎯</div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: colors.carbonGray }}
                >
                  Smart Matching
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: colors.carbonGray, opacity: 0.7 }}
                >
                  AI-powered analysis compares your profile with job
                  requirements to show you exactly where you stand.
                </p>
              </div>
            </div>

            <div
              className="group relative p-10 rounded-3xl overflow-hidden transition-all hover:scale-105 hover:shadow-lg cursor-pointer border border-teal-300"
              style={{ backgroundColor: colors.mintMist }}
            >
              <img
                src="/Time.gif"
                alt=""
                className="absolute inset-0 z-20 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative z-10">
                <div className="text-5xl mb-5">⚡</div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: colors.carbonGray }}
                >
                  Save Time
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: colors.carbonGray, opacity: 0.7 }}
                >
                  Focus only on jobs that match your skills and career goals. No
                  more wasted applications.
                </p>
              </div>
            </div>

            <div className="group relative p-10 rounded-3xl transition-all hover:scale-105 hover:shadow-lg overflow-hidden cursor-pointer border border-pink-300 bg-[#FFF4F4] hover:bg-white">
              <img
                src="/Insight.gif"
                alt=""
                className="absolute inset-0 z-20  w-[90%] h-[90%] mx-auto my-auto object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="relative z-10">
                <div className="text-5xl mb-5">📊</div>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: colors.carbonGray }}
                >
                  Deep Insights
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: colors.carbonGray, opacity: 0.7 }}
                >
                  Get detailed breakdowns on technical skills, soft skills, and
                  culture compatibility scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
  id="works"
  className="relative py-28 px-6 overflow-hidden bg-[#07000f]"
>
  {/* Ambient glow */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2
      rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)]
      blur-3xl" />
  </div>

  <div className="max-w-6xl mx-auto">
    {/* Heading */}
    <div className="text-center mb-20">
      <h2 className="text-4xl lg:text-5xl font-semibold text-white">
        Three steps to{" "}
        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          smarter job hunting
        </span>
      </h2>

      <p className="mt-4 text-lg text-purple-200/70 max-w-2xl mx-auto">
        A simple, AI-powered flow that tells you when a job is worth applying for.
      </p>
    </div>

    {/* Steps */}
    <div className="grid md:grid-cols-3 gap-10 relative">
      {[
        {
          step: "01",
          title: "Build Your Profile",
          desc: "Add your skills, experience level, and career preferences in under 2 minutes.",
        },
        {
          step: "02",
          title: "Paste Job Description",
          desc: "Copy any job description from LinkedIn, Indeed, or anywhere and paste it in.",
        },
        {
          step: "03",
          title: "Get Match Report",
          desc: "Receive instant analysis with match scores, skill gaps, and application tips.",
        },
      ].map((item) => (
        <div
          key={item.step}
          className="group relative rounded-3xl p-8
          bg-gradient-to-b from-white/10 to-white/5
          backdrop-blur-xl border border-purple-500/20
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          hover:-translate-y-2 transition-all duration-300"
        >
          {/* Step orb */}
          <div
            className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center
            text-sm font-semibold text-white
            bg-gradient-to-br from-purple-500 to-indigo-500
            shadow-[0_0_30px_rgba(168,85,247,0.6)]
            group-hover:shadow-[0_0_45px_rgba(168,85,247,0.9)]
            transition"
          >
            {item.step}
          </div>

          <h3 className="text-xl font-semibold text-white mb-3">
            {item.title}
          </h3>

          <p className="text-purple-200/70 leading-relaxed">
            {item.desc}
          </p>

          {/* Corner glow */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl
            opacity-0 group-hover:opacity-100 transition
            bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.25),transparent_60%)]" />
        </div>
      ))}
    </div>
  </div>
</section>


      {/* CTA Strip */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: colors.deepTeal }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to find jobs that actually fit?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of developers, designers, and remote workers making
            smarter career moves.
          </p>
          <button
            className="px-10 py-4 text-lg font-semibold rounded-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
            style={{ backgroundColor: colors.white, color: colors.deepTeal }}
            onClick={() => router.push("/login")}
          >
            Start Matching Jobs Free →
          </button>
          <p className="text-sm text-white/70 mt-4">
            No payment needed • Setup in 60 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p
            className="text-xs font-medium"
            style={{ color: colors.carbonGray, opacity: 0.5 }}
          >
            RoleFit • v0.2 • Built for remote workers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MatchifyLanding;
