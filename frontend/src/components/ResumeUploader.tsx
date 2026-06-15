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
    <div className="w-full max-w-lg mx-auto">
      {/* Error state alert */}
      {(error || uploadState.error) && (
        <div className="mb-4 flex items-start gap-3 p-3.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs shadow-sm">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-red-800 dark:text-red-200">Validation Error</p>
            <p className="opacity-90 font-light">{error || uploadState.error}</p>
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
          className={`relative overflow-hidden group cursor-pointer border border-dashed rounded-xl p-10 transition-colors duration-200 text-center flex flex-col items-center justify-center gap-4 bg-slate-100/40 hover:bg-slate-100/80 dark:bg-slate-900/10 dark:hover:bg-slate-900/20
            ${
              isDragActive
                ? "border-indigo-500 bg-slate-100 dark:bg-slate-900/40"
                : "border-slate-300 hover:border-slate-400 dark:border-slate-800 dark:hover:border-slate-700"
            }
          `}
        >
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-950/80 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors group-hover:border-slate-300 dark:group-hover:border-slate-700">
            <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          </div>

          <div className="space-y-1 z-10">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              Select or drop your resume
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto font-normal">
              Only PDF formats are supported
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
            className="mt-1 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-700 hover:text-slate-955 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:text-white dark:hover:border-slate-700 dark:hover:bg-slate-800/50 transition-colors shadow-sm"
          >
            Browse Files
          </button>
        </div>
      ) : (
        /* File Card when file selected */
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 rounded-xl p-5 shadow-sm space-y-5 animate-scale-up transition-colors duration-200">
          <div className="flex items-center justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate pr-2" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
            </div>

            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-800 transition-colors"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload progress bar */}
          {isUploading && (
            <div className="space-y-2 px-0.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>Uploading...</span>
                <span>{uploadState.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-900">
                <div
                  className="h-full bg-gradient-to-r from-indigo-700 to-indigo-500 dark:from-indigo-600 dark:to-blue-500 transition-all duration-300 rounded-full"
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
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 dark:bg-slate-900 hover:dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 shadow-sm transition-colors"
              >
                Upload & Analyze
              </button>
            </div>
          )}

          {isUploading && (
            <button
              disabled
              className="w-full px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2"
            >
              <div className="w-3.5 h-3.5 border border-slate-400 dark:border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </button>
          )}
        </div>
      )}
    </div>
  );
};
