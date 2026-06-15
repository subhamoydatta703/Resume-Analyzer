export interface ResumeUploadResponse {
  resumeId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface WorkExperience {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface EducationInfo {
  degree: string;
  school: string;
  year: string;
}

export interface AnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  formattingScore: number;
  candidateInfo: CandidateInfo;
  summary: string;
  skills: SkillCategory[];
  experience: WorkExperience[];
  education: EducationInfo[];
  strengths: string[];
  improvements: string[];
  suggestedRoles: string[];
}

export interface ResumeDetailsResponse {
  id: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  analysisResult?: AnalysisResult;
}

export type UploadStatus = "idle" | "uploading" | "pending" | "completed" | "failed";

export interface UploadState {
  status: UploadStatus;
  progress: number;
  resumeId: string | null;
  error: string | null;
  fileName: string | null;
  fileSize: number | null;
  analysisResult?: AnalysisResult | null;
}
