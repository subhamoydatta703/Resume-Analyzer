import React, { useEffect, useState } from "react";
import { FileText, Cpu, Compass, Server, Check } from "lucide-react";

interface PendingScannerProps {
  resumeId: string;
  fileName: string | null;
}

const PARSING_LOGS = [
  "Establishing secure API connection...",
  "Retrieving upload token...",
  "Loading document parser models...",
  "Extracting unstructured text blocks...",
  "Performing optical character boundary validation...",
  "Running tokenization & syntactic grouping...",
  "Classifying professional experience metrics...",
  "Cross-referencing skills schema with taxonomy database...",
  "Running ATS matching algorithm...",
  "Finalizing analysis report scores...",
];

export const PendingScanner: React.FC<PendingScannerProps> = ({
  resumeId,
  fileName,
}) => {
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([PARSING_LOGS[0]]);

  useEffect(() => {
    if (activeLogIndex < PARSING_LOGS.length - 1) {
      const timer = setTimeout(() => {
        const nextIndex = activeLogIndex + 1;
        setActiveLogIndex(nextIndex);
        setVisibleLogs((prev) => [...prev, PARSING_LOGS[nextIndex]].slice(-4));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activeLogIndex]);

  return (
    <div className="w-full max-w-lg border border-slate-800 bg-slate-900/60 rounded-3xl p-8 text-center space-y-8 shadow-2xl backdrop-blur-md border-t-slate-700/30 animate-scale-up">
      {/* File parsing visual */}
      <div className="relative w-28 h-32 mx-auto bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-4 overflow-hidden shadow-inner group">
        {/* Animated Laser Beam */}
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_#8b5cf6] animate-scan-beam"></div>
        
        {/* Icon with light pulses */}
        <FileText className="w-12 h-12 text-slate-500 group-hover:text-violet-400 transition-colors duration-500 animate-pulse" />
        
        {/* Extracted snippet indicators */}
        <div className="w-full mt-3 space-y-1.5 opacity-60">
          <div className="h-1 bg-slate-800 rounded w-5/6 mx-auto"></div>
          <div className="h-1 bg-slate-800 rounded w-4/6 mx-auto"></div>
          <div className="h-1 bg-slate-800 rounded w-5/6 mx-auto"></div>
        </div>
      </div>

      <div className="space-y-2.5">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping"></span>
          Parsing Curriculum Vitae...
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Currently analyzing <span className="text-slate-200 font-semibold">{fileName || "Resume"}</span>. 
          This may take a few seconds as the AI models extract skills and experience.
        </p>
      </div>

      {/* Parsing Logs console */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 text-left font-mono text-xs space-y-3 shadow-inner">
        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-900 pb-2">
          <span>Process Logs</span>
          <span className="flex items-center gap-1">
            <Server className="w-3 h-3 text-violet-400 animate-pulse" /> 
            ID: {resumeId.slice(0, 10)}
          </span>
        </div>
        
        <div className="space-y-2 h-28 overflow-hidden flex flex-col justify-end">
          {visibleLogs.map((log, i) => {
            const isLast = i === visibleLogs.length - 1;
            return (
              <div
                key={log}
                className={`flex items-start gap-2 transition-all duration-300 ${
                  isLast ? "text-violet-400 font-semibold" : "text-slate-500"
                }`}
              >
                {isLast ? (
                  <Cpu className="w-3.5 h-3.5 mt-0.5 shrink-0 animate-spin text-violet-400" />
                ) : (
                  <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500/70" />
                )}
                <span className="truncate">{log}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scanning status banner */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>ATS Pipeline Ready</span>
        </div>
        <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
        <span>Version 1.0.0</span>
      </div>
    </div>
  );
};
