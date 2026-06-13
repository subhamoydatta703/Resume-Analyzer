import React, { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { Upload, FileText, AlertCircle, X } from "lucide-react";
import type { UploadState } from "../types";

interface ResumeUploaderProps {
  uploadState: UploadState;
  onUpload: (file: File) => void;
  onCancel: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  uploadState,
  onUpload,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formatting utility for file size
  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // Drag handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Input click handler
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file only.");
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    onCancel();
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const isUploading = uploadState.status === "uploading";

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Error state alert */}
      {(error || uploadState.error) && (
        <div className="mb-4 flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm backdrop-blur-md animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Upload failed</p>
            <p className="opacity-90">{error || uploadState.error}</p>
          </div>
        </div>
      )}

      {/* Main Drag Box / Selection Display */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={`relative overflow-hidden group cursor-pointer border-2 border-dashed rounded-3xl p-10 transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 backdrop-blur-md
            ${
              isDragActive
                ? "border-violet-500 bg-violet-600/10 shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[0.99]"
                : "border-slate-700/60 bg-slate-900/40 hover:border-slate-500/80 hover:bg-slate-800/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            }
          `}
        >
          {/* Visual glow element behind icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/10 transition-all duration-300"></div>

          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:scale-110 group-hover:border-violet-500/30 group-hover:bg-violet-600/5 transition-all duration-300">
            <Upload className="w-7 h-7 text-slate-400 group-hover:text-violet-400 transition-colors" />
          </div>

          <div className="space-y-1 z-10">
            <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">
              Upload your resume
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Drag and drop your PDF file here, or click to browse files
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleInputChange}
            className="hidden"
          />

          <button
            type="button"
            className="mt-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:border-slate-500/50 hover:bg-slate-700/40 transition-all"
          >
            Select PDF File
          </button>
        </div>
      ) : (
        /* File Card when file selected */
        <div className="border border-slate-700/60 bg-slate-900/60 rounded-3xl p-6 shadow-xl backdrop-blur-md border-t-slate-600/40 space-y-6 animate-scale-up">
          <div className="flex items-center justify-between gap-4 p-3 bg-slate-800/40 border border-slate-800 rounded-2xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate pr-2" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700/40 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-violet-400">Uploading file...</span>
                <span className="text-slate-300">{uploadState.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadState.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!isUploading && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex-1 px-5 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600/60 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex-1 px-5 py-3 rounded-2xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-violet-500/20 hover:border-violet-400/20 shadow-[0_8px_20px_-6px_rgba(139,92,246,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Upload & Analyze
              </button>
            </div>
          )}

          {isUploading && (
            <button
              disabled
              className="w-full px-5 py-3 rounded-2xl text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center gap-2"
            >
              <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              Processing on Server...
            </button>
          )}
        </div>
      )}
    </div>
  );
};
