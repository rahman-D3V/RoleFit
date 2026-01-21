"use client";
import Navbar from "@/components/navbar";
import { BackgroundLines } from "@/components/ui/background-lines";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
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
    <div className="min-h-screen  font-sans antialiased">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <BackgroundLines className="relative min-h-[90vh] overflow-hidden bg-[#090012] px-6 -mt-10 flex items-center justify-center">
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
          {isUserLogin ? (
            <div
              className="inline-flex mb-6 px-4 py-1.5 rounded-full text-xs font-medium
        bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              Welcome back, {localAuthData?.userName}
            </div>
          ) : (
            <div
              className="inline-flex mb-6 px-4 py-1.5 rounded-full text-xs font-medium
        bg-purple-500/10 text-purple-300 border border-purple-500/20"
            >
              Welcome to RoleFit
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
      </BackgroundLines>

      <div className=" py-4 relative sm:-mt-20    py-28 px-6 overflow-hidden bg-[#07000f]">
        <h2 className="text-4xl text-center lg:text-5xl font-semibold text-white md:mb-10 mb-4">
          Why{" "}
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            RoleFit
          </span>{" "}
          works
        </h2>
        <StickyScroll content={content} />
      </div>

      {/* How It Works */}
      <section
        id="works"
        className="relative py-28 px-6 overflow-hidden cursor-pointer bg-[#07000f]"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2
      rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)]
      blur-3xl"
          />
        </div>

        <section
          id="works"
          className="relative py-28 -mt-57 px-6 overflow-hidden block md:hidden bg-[#07000f]"
        >
          {" "}
          {/* Ambient glow */}{" "}
          <div className="absolute inset-0 -z-10">
            {" "}
            <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18),transparent_65%)] blur-3xl" />{" "}
          </div>{" "}
          <div className="max-w-6xl mx-auto">
            {" "}
            {/* Heading */}{" "}
            <div className="text-center mb-20">
              {" "}
              <h2 className="text-4xl lg:text-5xl font-semibold text-white">
                {" "}
                Three steps to{" "}
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {" "}
                  smarter job hunting{" "}
                </span>{" "}
              </h2>{" "}
              <p className="mt-4 text-lg text-purple-200/70 max-w-2xl mx-auto">
                {" "}
                A simple, AI-powered flow that tells you when a job is worth
                applying for.{" "}
              </p>{" "}
            </div>{" "}
            {/* Steps */}{" "}
            <div className="grid md:grid-cols-3 gap-10 relative">
              {" "}
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
                  className="group relative rounded-3xl p-8 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-purple-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition-all duration-300"
                >
                  {" "}
                  {/* Step orb */}{" "}
                  <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center text-sm font-semibold text-white bg-gradient-to-br from-purple-500 to-indigo-500 shadow-[0_0_30px_rgba(168,85,247,0.6)] group-hover:shadow-[0_0_45px_rgba(168,85,247,0.9)] transition">
                    {" "}
                    {item.step}{" "}
                  </div>{" "}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {" "}
                    {item.title}{" "}
                  </h3>{" "}
                  <p className="text-purple-200/70 leading-relaxed">
                    {" "}
                    {item.desc}{" "}
                  </p>{" "}
                  {/* Corner glow */}{" "}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.25),transparent_60%)]" />{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </section>

        <div className="hidden md:block max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-semibold text-white">
              Three steps to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                smarter job hunting
              </span>
            </h2>

            <p className="mt-4 text-lg text-purple-200/70 max-w-2xl mx-auto">
              A simple, AI-powered flow that tells you when a job is worth
              applying for.
            </p>
          </div>

          {/* Steps */}
          <div className="flex  gap-10 relative">
            {[
              {
                step: "01",
                title: "Build Profile",
                desc: "Add your skills, experience level, and career preferences in under 2 minutes.",
              },
              {
                step: "02",
                title: "Paste JD",
                desc: "Copy any job description from LinkedIn, Indeed, or anywhere and paste it in.",
              },
              {
                step: "03",
                title: "Get Match Report",
                desc: "Receive instant analysis with match scores, skill gaps, and application tips.",
              },
            ].map((item,index) => (
              <div key={index} className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto p-4 relative">
                <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
                <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

                <EvervaultCard text={`${item.title}`} className="text-center" />

                <h2 className="dark:text-white text-black mt-4 text-sm font-light">
                  {item.desc}
                </h2>
                <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
                  {item.step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="relative md:-mt-0 -mt-40 overflow-hidden bg-[#07000f] py-28 px-6">
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute left-1/2 top-1/2 h-[700px] w-[700px]
      -translate-x-1/2 -translate-y-1/2 rounded-full
      bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.25),transparent_65%)]
      blur-3xl"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6">
            Ready to find jobs that{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              actually fit?
            </span>
          </h2>

          <p className="text-lg lg:text-xl text-purple-200/70 mb-10 max-w-2xl mx-auto">
            Join developers, designers, and remote professionals making smarter
            career moves with AI-powered matching.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center
      px-10 py-4 text-lg font-semibold rounded-full text-white
      bg-gradient-to-r from-purple-500 to-indigo-500
      shadow-[0_0_40px_rgba(168,85,247,0.5)]
      hover:shadow-[0_0_65px_rgba(168,85,247,0.8)]
      hover:-translate-y-0.5 transition"
          >
            Start Matching Jobs Free →
          </button>

          <p className="text-sm text-purple-200/60 mt-6">
            No payment needed • Setup in 60 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative md:-mt-0 -mt-15 bg-[#05000c] py-10 px-6 border-t border-white/5">
        {/* subtle top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-medium text-purple-200/50">
            RoleFit • v0.2 • Built for remote workers
          </p>
        </div>
      </footer>
    </div>
  );
};

const content = [
  {
    title: "🎯 Smart Matching",
    description:
      "AI-powered analysis compares your profile with job requirements to show you exactly where you stand.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://cdn.dribbble.com/userupload/24462579/file/original-2207aef6b5b4b818cd5ea90870763dc1.gif"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "⚡ Save Time",
    description:
      "Focus only on jobs that match your skills and career goals. No more wasted applications.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://cdn.dribbble.com/userupload/20045688/file/original-72b24615435d4f7da6c9ac3bf433e9ce.gif"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "📊 Deep Insights",
    description:
      "Get detailed breakdowns on technical skills, soft skills, and culture compatibility scores.Get detailed breakdowns on technical skills, soft skills, and culture compatibility scores.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <img
          src="https://cdn.dribbble.com/userupload/21210735/file/original-f7ebdf65860bfbfd73e5355d596ccf06.gif"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "🚀 Apply with Confidence",
    description:
      "Make informed decisions backed by data. Apply only when you know you’re a strong match, not just hoping you are.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white">
        Running out of content
      </div>
    ),
  },
];

export default MatchifyLanding;
