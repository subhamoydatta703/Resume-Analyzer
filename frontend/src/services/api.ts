import axios from "axios";
import type { ResumeUploadResponse, ResumeDetailsResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Real API methods
export const uploadResume = async (
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await apiClient.post<ResumeUploadResponse>(
    "/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    }
  );

  return response.data;
};

export const getResumeDetails = async (
  resumeId: string
): Promise<ResumeDetailsResponse> => {
  const response = await apiClient.get<ResumeDetailsResponse>(`/resume/${resumeId}`);
  return response.data;
};

// Stateful mock variables
interface MockSession {
  resumeId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  fileName: string;
  callsCount: number;
}

const mockSessions: Record<string, MockSession> = {};

// Mock API implementations
export const uploadResumeMock = (
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<ResumeUploadResponse> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (onUploadProgress) {
        onUploadProgress(Math.min(progress, 100));
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        
        const resumeId = `res_${Math.random().toString(36).substring(2, 11)}`;
        
        // Save mock session details
        mockSessions[resumeId] = {
          resumeId,
          status: "PENDING",
          fileName: file.name,
          callsCount: 0
        };
        
        resolve({
          resumeId,
          status: "PENDING",
        });
      }
    }, 150);
  });
};

export const getResumeDetailsMock = (
  resumeId: string
): Promise<ResumeDetailsResponse> => {
  return new Promise((resolve, reject) => {
    const session = mockSessions[resumeId];
    if (!session) {
      reject(new Error("Resume details not found"));
      return;
    }

    session.callsCount += 1;

    // Simulate 2 polling requests of PENDING state (approx 4 seconds total)
    if (session.callsCount < 3) {
      resolve({
        id: resumeId,
        status: "PENDING"
      });
      return;
    }

    // After 2 calls, transition to either COMPLETED or FAILED based on filename
    if (session.fileName.toLowerCase().includes("error") || session.fileName.toLowerCase().includes("fail")) {
      session.status = "FAILED";
      resolve({
        id: resumeId,
        status: "FAILED"
      });
    } else {
      session.status = "COMPLETED";
      resolve({
        id: resumeId,
        status: "COMPLETED",
        analysisResult: {
          overallScore: 88,
          atsCompatibility: 92,
          formattingScore: 85,
          candidateInfo: {
            name: "Alex Morgan",
            email: "alex.morgan@devmail.com",
            phone: "+1 (555) 019-2834",
            location: "San Francisco, CA",
            linkedin: "linkedin.com/in/alex-morgan-dev"
          },
          summary: "Senior Full-Stack Engineer with 6+ years of experience specializing in React, Node.js, and cloud architectures. Proven track record of leading development teams, optimizing complex database workflows, and deploying scalable SaaS applications.",
          skills: [
            {
              category: "Frontend Development",
              items: ["React", "TypeScript", "Next.js", "TailwindCSS", "Redux Toolkit", "Webpack"]
            },
            {
              category: "Backend & Databases",
              items: ["Node.js", "Express.js", "NestJS", "PostgreSQL", "MongoDB", "Prisma ORM"]
            },
            {
              category: "DevOps & Cloud",
              items: ["AWS (S3, EC2, Lambda)", "Docker", "CI/CD (GitHub Actions)", "Vercel", "Linux"]
            },
            {
              category: "Methodologies & Soft Skills",
              items: ["Agile/Scrum", "System Design", "Technical Leadership", "Code Review"]
            }
          ],
          experience: [
            {
              role: "Senior Full Stack Engineer",
              company: "InnovateTech Solutions",
              duration: "2023 - Present",
              description: [
                "Architected and deployed a collaborative analytics platform using Next.js and NestJS, boosting active user engagement by 40%.",
                "Led a squad of 4 developers to build a real-time notification engine using WebSockets and Redis, processing 10k+ requests per minute.",
                "Implemented automated unit and integration test coverage raising codebase confidence from 45% to 88%."
              ]
            },
            {
              role: "Software Engineer II",
              company: "CloudCore Systems",
              duration: "2021 - 2023",
              description: [
                "Developed core features for a cloud provisioning portal in TypeScript, improving system throughput by 25%.",
                "Optimized PostgreSQL complex queries and database indexes, reducing loading latencies by 350ms on critical endpoints.",
                "Dockerized deployment pipelines, reducing release-cycle failures by 15%."
              ]
            }
          ],
          education: [
            {
              degree: "Bachelor of Science in Computer Science",
              school: "State University",
              year: "2017 - 2021"
            }
          ],
          strengths: [
            "Excellent skill-set alignment with modern web and cloud-native standards.",
            "Clear articulation of business outcomes in job descriptions rather than pure technical tasks.",
            "Strong backend and query optimization experience."
          ],
          improvements: [
            "Add quantifiable business metrics to the Software Engineer II role details.",
            "Incorporate missing industry keywords like 'Infrastructure as Code' or 'Kubernetes' if matching DevOps roles.",
            "Add direct links to portfolio projects or open source contributions."
          ],
          suggestedRoles: ["Senior Full-Stack Engineer", "Lead Developer", "Cloud Solutions Engineer"]
        }
      });
    }
  });
};
