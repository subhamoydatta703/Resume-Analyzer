import React, { useState, useEffect, useRef } from "react";
import { Sparkles, AlertCircle, RefreshCw, Activity, Sun, Moon } from "lucide-react";
import { ResumeUploader } from "../components/ResumeUploader";
import { PendingScanner } from "../components/PendingScanner";
import { AnalysisDashboard } from "../components/AnalysisDashboard";
import { uploadResume, analyzeResume, getResumeDetails } from "../services/api";
import type { UploadState } from "../types";

export const UploadPage: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );
  
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    resumeId: null,
    error: null,
    fileName: null,
    fileSize: null,
    analysisResult: null,
  });

  const pollingTimerRef = useRef<number | null>(null);

  // Sync theme to <html> element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) {
        window.clearInterval(pollingTimerRef.current);
      }
    };
  }, []);

  const handleUpload = async (file: File) => {
    setUploadState({
      status: "uploading",
      progress: 0,
      resumeId: null,
      error: null,
      fileName: file.name,
      fileSize: file.size,
      analysisResult: null,
    });

    try {
      const response = await uploadResume(file, (progress) => {
        setUploadState((prev) => ({ ...prev, progress }));
      });

      console.log("Upload response:", response);

      const resumeId = response.resumeId;

      setUploadState((prev) => ({
        ...prev,
        status: "pending",
        resumeId,
        error: null,
      }));

      // Start live analysis synchronously
      startPolling(resumeId);
    } catch (err: any) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during upload. Please verify that your backend server is active.";
      
      setUploadState((prev) => ({
        ...prev,
        status: "failed",
        error: errorMessage,
      }));
    }
  };

  const startPolling = async (resumeId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts * 2 seconds = 60 seconds max

    // 1. Initial check to see if the resume has already been analyzed (e.g. cached/completed in DB)
    try {
      const initialCheck = await getResumeDetails(resumeId);
      if (initialCheck.status === "COMPLETED" && initialCheck.analysisResult) {
        setUploadState((prev) => ({
          ...prev,
          status: "completed",
          analysisResult: initialCheck.analysisResult || null,
          error: null,
        }));
        return;
      }
    } catch (err) {
      console.warn("Initial DB cache check failed/pending, triggering analysis...", err);
    }

    // 2. Trigger the analysis via POST. Since the connection might be synchronous and block,
    // we fire the request and handle completion.
    try {
      const response = await analyzeResume(resumeId);
      console.log("Analysis POST response:", response);

      if (response.status === "COMPLETED" && response.analysisResult) {
        setUploadState((prev) => ({
          ...prev,
          status: "completed",
          analysisResult: response.analysisResult || null,
          error: null,
        }));
        return;
      }
    } catch (err: any) {
      console.error("POST analysis failed, checking for updates...", err);
      // If POST fails (e.g., timeout/network issue), the server might still process the analysis.
      // We fall back to polling the GET endpoint below.
    }

    // 3. Polling loop: fallback/monitoring status via GET request
    const pollInterval = window.setInterval(async () => {
      attempts++;
      try {
        const check = await getResumeDetails(resumeId);
        if (check.status === "COMPLETED" && check.analysisResult) {
          window.clearInterval(pollInterval);
          setUploadState((prev) => ({
            ...prev,
            status: "completed",
            analysisResult: check.analysisResult || null,
            error: null,
          }));
        } else if (check.status === "FAILED") {
          window.clearInterval(pollInterval);
          setUploadState((prev) => ({
            ...prev,
            status: "failed",
            error: "Resume analysis failed on the server.",
          }));
        } else if (attempts >= maxAttempts) {
          window.clearInterval(pollInterval);
          setUploadState((prev) => ({
            ...prev,
            status: "failed",
            error: "Analysis timed out. Please try again.",
          }));
        }
      } catch (pollErr: any) {
        console.error("Error during polling:", pollErr);
        if (attempts >= maxAttempts) {
          window.clearInterval(pollInterval);
          setUploadState((prev) => ({
            ...prev,
            status: "failed",
            error: pollErr.message || "Failed to retrieve analysis status.",
          }));
        }
      }
    }, 2000);

    pollingTimerRef.current = pollInterval;
  };

  const handleReset = () => {
    setUploadState({
      status: "idle",
      progress: 0,
      resumeId: null,
      error: null,
      fileName: null,
      fileSize: null,
      analysisResult: null,
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0b0f19] dark:text-slate-200 flex flex-col items-center justify-between p-6 md:p-10 font-sans selection:bg-slate-200 dark:selection:bg-slate-800 selection:text-slate-900 dark:selection:text-white transition-colors duration-200">
      
      {/* Top utility bar */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 z-10 border-b border-slate-200 dark:border-slate-900/60 transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md border border-indigo-500/20">
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <span className="font-semibold tracking-tight text-md text-slate-900 dark:text-white transition-colors">
            Resume Analyzer
          </span>
        </div>
        
        {/* Right utility items: status badge & theme toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium select-none shadow-sm transition-colors duration-200">
            <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Live API Active</span>
          </div>

          <button
            onClick={toggleTheme}
            type="button"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main content container */}
      <main className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center my-10 md:my-16 z-10 px-2">
        
        {/* State routing */}
        {uploadState.status === "idle" || uploadState.status === "uploading" ? (
          <>
            {/* Hero Section */}
            <div className="text-center max-w-2xl mb-12 space-y-4 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight transition-colors">
                Analyze your resume
              </h1>
              <p className="text-sm md:text-md text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-normal transition-colors">
                Upload your PDF resume. Our models will extract layout structures, compile candidate info, and list technical skills.
              </p>
            </div>

            {/* Resume Uploader component */}
            <ResumeUploader
              uploadState={uploadState}
              onUpload={handleUpload}
              onCancel={handleReset}
            />
          </>
        ) : uploadState.status === "pending" ? (
          <PendingScanner 
            resumeId={uploadState.resumeId || ""} 
            fileName={uploadState.fileName} 
          />
        ) : uploadState.status === "completed" && uploadState.analysisResult ? (
          <AnalysisDashboard 
            analysisResult={uploadState.analysisResult} 
            onReset={handleReset} 
            fileName={uploadState.fileName}
          />
        ) : (
          /* Failed / Error Screen */
          <div className="w-full max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 rounded-2xl p-8 text-center space-y-6 shadow-sm animate-scale-up transition-colors duration-200">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500 dark:text-red-400">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight transition-colors">Analysis Failed</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light transition-colors">
                {uploadState.error || "An error occurred while analyzing the resume."}
              </p>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 group transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="w-full text-center py-6 border-t border-slate-200 dark:border-slate-900/60 text-xs text-slate-400 dark:text-slate-650 font-normal z-10 transition-colors duration-200">
        &copy; {new Date().getFullYear()} Resume Analyzer. All rights reserved.
      </footer>
    </div>
  );
};
