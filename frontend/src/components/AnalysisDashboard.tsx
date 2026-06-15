import React, { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Link, Briefcase, GraduationCap, 
  TrendingUp, CheckCircle, AlertTriangle, Lightbulb, RefreshCw 
} from "lucide-react";
import type { AnalysisResult } from "../types";

interface AnalysisDashboardProps {
  analysisResult: AnalysisResult;
  onReset: () => void;
  fileName: string | null;
}

const ScoreCard: React.FC<{ score: number; label: string; barColor: string }> = ({ 
  score, 
  label, 
  barColor 
}) => {
  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 space-y-3 shadow-sm hover:border-slate-300 dark:hover:border-slate-800 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{score}</span>
        <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-900">
        <div 
          className={`h-full ${barColor} rounded-full`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysisResult,
  onReset,
  fileName,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "experience" | "insights">("overview");

  console.log("AnalysisDashboard data:", analysisResult);

  const {
    overallScore = 0,
    atsCompatibility = 0,
    formattingScore = 0,
    candidateInfo = {} as any,
    summary = "",
    skills = [],
    experience = [],
    education = [],
    strengths = [],
    improvements = [],
    suggestedRoles = [],
  } = analysisResult || {};

  const name = candidateInfo?.name || "Candidate Profile";
  const email = candidateInfo?.email || "Not Found";
  const phone = candidateInfo?.phone || "Not Found";
  const location = candidateInfo?.location || "Not Found";
  const linkedin = candidateInfo?.linkedin || "";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-scale-up">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 transition-colors duration-200">
        <div>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Analysis Result</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 leading-tight transition-colors">{name}</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">Parsed from: <span className="text-slate-700 dark:text-slate-300 font-medium">{fileName || "Resume"}</span></p>
        </div>
        <button
          onClick={onReset}
          className="self-start md:self-center flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          New Analysis
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Sidebar details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Score Cards */}
          <div className="grid grid-cols-1 gap-4">
            <ScoreCard score={overallScore} label="Overall Score" barColor="bg-indigo-600 dark:bg-indigo-500" />
            <ScoreCard score={atsCompatibility} label="ATS Score" barColor="bg-blue-600 dark:bg-blue-500" />
            <ScoreCard score={formattingScore} label="Formatting Score" barColor="bg-emerald-600 dark:bg-emerald-500" />
          </div>

          {/* Contact Details Card */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 space-y-4 shadow-sm transition-colors duration-200">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-900/60 pb-2.5">Metadata</h3>
            
            <div className="space-y-3 text-xs font-normal">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="truncate font-semibold text-slate-900 dark:text-white transition-colors">{name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                {email && email !== "Not Found" ? (
                  <a href={`mailto:${email}`} className="truncate font-medium hover:text-indigo-600 dark:hover:text-white transition-colors">
                    {email}
                  </a>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600">Not Found</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{location}</span>
              </div>
              {linkedin && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Link className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="truncate font-medium hover:text-indigo-600 dark:hover:text-white transition-colors">
                    {linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Panels */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          
          {/* Navigation Tabs (SaaS styling) */}
          <div className="flex border-b border-slate-200 dark:border-slate-900 gap-6 px-1 transition-colors duration-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 text-xs font-semibold relative transition-colors duration-200 ${
                activeTab === "overview"
                  ? "text-slate-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-600 dark:after:bg-indigo-500"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`py-3 text-xs font-semibold relative transition-colors duration-200 ${
                activeTab === "skills"
                  ? "text-slate-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-600 dark:after:bg-indigo-500"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Skills Matrix
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`py-3 text-xs font-semibold relative transition-colors duration-200 ${
                activeTab === "experience"
                  ? "text-slate-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-600 dark:after:bg-indigo-500"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`py-3 text-xs font-semibold relative transition-colors duration-200 ${
                activeTab === "insights"
                  ? "text-slate-900 dark:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-indigo-600 dark:after:bg-indigo-500"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              AI Insights
            </button>
          </div>

          {/* Tab content panel */}
          <div className="flex-1 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 min-h-[400px] shadow-sm transition-colors duration-200">
            
            {/* Overview Panel */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-scale-up">
                <div className="space-y-2">
                  <h3 className="text-md font-semibold text-slate-800 dark:text-white">Summary</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200 dark:border-slate-900/60 font-normal transition-colors">
                    {summary || "No summary details were parsed."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  <div className="p-4.5 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-900 rounded-xl space-y-2 transition-colors">
                    <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      Suggested Roles
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {suggestedRoles.length > 0 ? (
                        suggestedRoles.map((role) => (
                          <span key={role} className="text-[11px] font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 rounded-md transition-colors">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-light">None suggested</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4.5 bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-900 rounded-xl space-y-2 transition-colors">
                    <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      Education
                    </h4>
                    <div className="space-y-2.5 pt-1">
                      {education.length > 0 ? (
                        education.map((edu, idx) => (
                          <div key={idx} className="text-xs space-y-0.5">
                            <p className="font-semibold text-slate-700 dark:text-slate-200 leading-tight transition-colors">{edu.degree || "Degree Studies"}</p>
                            <p className="text-slate-500 text-[11px]">{edu.school || "University"} • {edu.year || "N/A"}</p>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-600 font-light">None extracted</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Panel */}
            {activeTab === "skills" && (
              <div className="space-y-5 animate-scale-up">
                <h3 className="text-md font-semibold text-slate-800 dark:text-white">Extracted Skills</h3>
                <div className="space-y-4">
                  {skills.length > 0 ? (
                    skills.map((skillCat) => (
                      <div key={skillCat.category || "General"} className="space-y-2">
                        <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{skillCat.category || "Skills"}</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(skillCat.items) && skillCat.items.length > 0 ? (
                            skillCat.items.map((skill: string) => (
                              <span 
                                key={skill} 
                                className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-300 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 rounded-lg transition-colors"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-600 font-light">None parsed</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">No skills mapped.</p>
                  )}
                </div>
              </div>
            )}

            {/* Experience Panel */}
            {activeTab === "experience" && (
              <div className="space-y-6 animate-scale-up">
                <h3 className="text-md font-semibold text-slate-800 dark:text-white font-semibold">Experience</h3>
                
                <div className="relative border-l border-slate-200 dark:border-slate-800 pl-5 ml-2 space-y-7">
                  {experience.length > 0 ? (
                    experience.map((exp, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[26px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:border-slate-900 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 transition-colors shadow-sm"></div>
                        
                        <div className="space-y-2">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-white tracking-tight transition-colors">{exp.role || "Role"}</h4>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">{exp.duration || "N/A"}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {exp.company || "Company"}
                          </p>
                          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2.5 pl-0.5 leading-relaxed font-normal transition-colors">
                            {Array.isArray(exp.description) ? (
                              exp.description.map((desc: string, dIdx: number) => (
                                <li key={dIdx} className="leading-relaxed pl-1 marker:text-slate-300 dark:marker:text-slate-800">
                                  <span className="relative -left-1 text-slate-500 dark:text-slate-400">{desc}</span>
                                </li>
                              ))
                            ) : (
                              <li className="leading-relaxed pl-1 marker:text-slate-300 dark:marker:text-slate-800">
                                <span className="relative -left-1 text-slate-500 dark:text-slate-400">{exp.description || ""}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-light">No experience parsed.</p>
                  )}
                </div>
              </div>
            )}

            {/* AI Insights Panel */}
            {activeTab === "insights" && (
              <div className="space-y-5 animate-scale-up">
                <h3 className="text-md font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Lightbulb className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                  AI Feedback
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  
                  {/* Strengths */}
                  <div className="space-y-3 p-4 border border-emerald-200 dark:border-slate-800 bg-emerald-50/20 dark:bg-slate-900/10 rounded-xl transition-colors">
                    <h4 className="text-[9px] font-bold text-emerald-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-slate-400" />
                      Strengths
                    </h4>
                    <ul className="space-y-2.5 pt-1">
                      {strengths.length > 0 ? (
                        strengths.map((str, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0"></span>
                            <span>{str}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 font-light">None listed</p>
                      )}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-3 p-4 border border-amber-200 dark:border-slate-800 bg-amber-50/20 dark:bg-slate-900/10 rounded-xl transition-colors">
                    <h4 className="text-[9px] font-bold text-amber-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-slate-400" />
                      Improvements
                    </h4>
                    <ul className="space-y-2.5 pt-1">
                      {improvements.length > 0 ? (
                        improvements.map((imp, idx) => (
                          <li key={idx} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0"></span>
                            <span>{imp}</span>
                          </li>
                        ))
                      ) : (
                        <p className="text-xs text-slate-550 font-light">None listed</p>
                      )}
                    </ul>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
