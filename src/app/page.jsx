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
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: colors.softIvory }}
    >
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="py-24 lg:py-32 px-6"
        style={{ backgroundColor: colors.warmSand }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            {isUserLogin && (
              <div
                className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-2"
                style={{
                  backgroundColor: colors.deepTeal,
                  color: colors.white,
                }}
              >
                {`Hey, ${localAuthData?.userName}`}
              </div>
            )}
            <h1
              className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              style={{ color: colors.carbonGray }}
            >
              Know your chances before applying{" "}
              <span style={{ color: colors.deepTeal }}>to an application</span>
            </h1>
            <p
              className="text-lg lg:text-xl leading-relaxed"
              style={{ color: colors.carbonGray, opacity: 0.75 }}
            >
              Paste any remote job description and get instant insights on match
              score, skill alignment and culture fit before you hit apply.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="px-8 py-4 font-semibold text-white rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                style={{ backgroundColor: colors.deepTeal }}
                onClick={handleStartFree}
              >
                Get Started Free →
              </button>
            </div>
            <p
              className="text-sm pt-2"
              style={{ color: colors.carbonGray, opacity: 0.5 }}
            >
              No credit card required • Free forever
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full transition-all hover:shadow-3xl hover:-translate-y-2 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: colors.mintMist }}
                >
                  💼
                </div>
                <div className="flex-1">
                  <div
                    className="h-3 rounded-full mb-2"
                    style={{ backgroundColor: colors.warmSand, width: "70%" }}
                  ></div>
                  <div
                    className="h-2 rounded-full"
                    style={{ backgroundColor: colors.mintMist, width: "40%" }}
                  ></div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.carbonGray }}
                    >
                      Skills Match
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.deepTeal }}
                    >
                      87%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{ width: "87%", backgroundColor: colors.deepTeal }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.carbonGray }}
                    >
                      Experience Level
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.deepTeal }}
                    >
                      92%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{ width: "92%", backgroundColor: colors.deepTeal }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.carbonGray }}
                    >
                      Culture Fit
                    </span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.deepTeal }}
                    >
                      79%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-1000"
                      style={{ width: "79%", backgroundColor: colors.deepTeal }}
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className="mt-6 text-center py-3 rounded-xl font-semibold text-sm"
                style={{
                  backgroundColor: colors.mintMist,
                  color: colors.deepTeal,
                }}
              >
                ✓ Strong Match • Apply Now
              </div>
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
        className="py-24 px-6"
        style={{ backgroundColor: colors.warmSand }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: colors.carbonGray }}
            >
              Three steps to smarter job hunting
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition-all group">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: colors.deepTeal }}
              >
                1
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colors.carbonGray }}
              >
                Build Your Profile
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: colors.carbonGray, opacity: 0.7 }}
              >
                Add your skills, experience level, and career preferences in
                under 2 minutes.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition-all group">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: colors.deepTeal }}
              >
                2
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colors.carbonGray }}
              >
                Paste Job Description
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: colors.carbonGray, opacity: 0.7 }}
              >
                Copy any remote job description from LinkedIn, Indeed, or
                anywhere and paste it in.
              </p>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition-all group">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: colors.deepTeal }}
              >
                3
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colors.carbonGray }}
              >
                Get Match Report
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: colors.carbonGray, opacity: 0.7 }}
              >
                Receive instant analysis with match scores, skill gaps, and
                application tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      {/* <section
        className="py-24 px-6"
        style={{ backgroundColor: colors.softIvory }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">🔒</div>
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.carbonGray }}
            >
              100% Private
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: colors.carbonGray, opacity: 0.7 }}
            >
              Your profile and job searches are completely private. We never
              share your data with employers or third parties.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-4xl mb-4">💡</div>
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: colors.carbonGray }}
            >
              Smart Recommendations
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: colors.carbonGray, opacity: 0.7 }}
            >
              The more you use RoleFit, the better it gets at understanding your
              preferences and suggesting perfect-fit roles.
            </p>
          </div>
        </div>
      </section> */}

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
