export const handleAnalyze = async () => {
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