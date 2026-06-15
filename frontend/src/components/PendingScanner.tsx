import React, { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";

interface PendingScannerProps {
  resumeId: string;
  fileName: string | null;
}

const STEPS = [
  "Parsing document layout",
  "Extracting resume sections",
  "Indexing skills and competencies",
  "Running scoring models",
];

export const PendingScanner: React.FC<PendingScannerProps> = ({
  resumeId,
  fileName,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 rounded-2xl p-8 text-center space-y-7 shadow-sm animate-scale-up transition-colors duration-200">
      {/* Sleek Loader */}
      <div className="flex items-center justify-center p-4">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-500 animate-spin" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight transition-colors">
          Analyzing resume
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed font-light transition-colors">
          Running structural parsing on <span className="text-slate-700 dark:text-slate-200 font-semibold">{fileName || "document"}</span>. This will take a few seconds.
        </p>
      </div>

      {/* Structured Minimal Steps */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-left space-y-3 transition-colors">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-900/60 pb-2 flex justify-between">
          <span>Analysis Progress</span>
          <span className="text-slate-400 dark:text-slate-600">ID: {resumeId.slice(0, 8)}</span>
        </div>
        
        <div className="space-y-2.5">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isActive = idx === activeStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-xs transition-colors duration-300 ${
                  isActive 
                    ? "text-slate-900 dark:text-white font-medium" 
                    : isCompleted 
                      ? "text-slate-500 dark:text-slate-400" 
                      : "text-slate-300 dark:text-slate-600"
                }`}
              >
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center border shrink-0 text-[10px] transition-colors ${
                  isCompleted 
                    ? "bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                    : isActive
                      ? "bg-indigo-600 border-indigo-500 text-white animate-pulse"
                      : "border-slate-300 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                }`}>
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span className="truncate">{step}...</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
