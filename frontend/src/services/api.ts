import axios from "axios";
import type { ResumeUploadResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadResume = async (
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<ResumeUploadResponse> => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await apiClient.post<ResumeUploadResponse>(
    "/api/resume/upload",
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

// Helper mock upload function for testing without backend active
export const uploadResumeMock = (
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<ResumeUploadResponse> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onUploadProgress) {
        onUploadProgress(Math.min(progress, 100));
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Simulating error for test cases
        if (file.name.toLowerCase().includes("error")) {
          reject(new Error("Mock API Error: File is corrupted or parsing failed."));
        } else {
          resolve({
            success: true,
            message: "Resume uploaded successfully (Mock Mode)",
            resumeId: `res_${Math.random().toString(36).substr(2, 9)}`,
          });
        }
      }
    }, 200);
  });
};
