import React, { useState, useCallback } from "react";
import { Upload, FileType, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadVideo } from "@/lib/api";

interface UploadSectionProps {
  onFileUpload?: (files: File[]) => void;
  supportedFormats?: string[];
  maxFileSize?: number; // in MB
  isUploading?: boolean;
  uploadProgress?: number;
  setIsUploading?: (isUploading: boolean) => void;
  setUploadProgress?: (progress: number) => void;
}

const UploadSection = ({
  onFileUpload = () => {},
  supportedFormats = [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  maxFileSize = 500, // 500MB default
  isUploading = false,
  uploadProgress = 0,
  setIsUploading = () => {},
  setUploadProgress = () => {},
}: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = (fileList: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const fileArray = Array.from(fileList);

    // Reset error
    setError(null);

    for (const file of fileArray) {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      // Check file type
      if (!supportedFormats.includes(extension)) {
        setError(
          `Unsupported file format: ${extension}. Please use: ${supportedFormats.join(", ")}`,
        );
        continue;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(
          `File too large: ${file.name}. Maximum size is ${maxFileSize}MB`,
        );
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleUpload = async (validFiles: File[]) => {
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload the first file (in a real app, you might want to handle multiple files)
      const result = await uploadVideo(validFiles[0], (progress) => {
        setUploadProgress(progress);
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Call the parent component's callback
        onFileUpload(validFiles);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      // In a real implementation, this would be set by the API response
      // For demo, we'll keep the progress at 100%
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const validFiles = validateFiles(e.dataTransfer.files);
        if (validFiles.length > 0) {
          setFiles(validFiles);
          handleUpload(validFiles);
        }
      }
    },
    [onFileUpload, supportedFormats, maxFileSize],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = validateFiles(e.target.files);
        if (validFiles.length > 0) {
          setFiles(validFiles);
          handleUpload(validFiles);
        }
      }
    },
    [onFileUpload, supportedFormats, maxFileSize],
  );

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Video</h2>

      {/* Drag and drop area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
          isUploading ? "pointer-events-none opacity-70" : "",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={supportedFormats.join(",")}
          onChange={handleFileInputChange}
          multiple
          disabled={isUploading}
        />

        <Upload className="h-12 w-12 text-gray-400 mb-4" />

        {isUploading ? (
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Uploading...</p>
            <div className="w-full max-w-md mb-2">
              <Progress value={uploadProgress} className="h-2" />
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
          </div>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">
              Drag & drop your video here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <Button variant="outline" className="mb-2">
              <FileType className="mr-2 h-4 w-4" /> Select Video Files
            </Button>
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* File information */}
      {files.length > 0 && !isUploading && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="text-sm flex items-center p-2 bg-gray-50 rounded-md"
              >
                <FileType className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium mr-2">{file.name}</span>
                <span className="text-gray-500 text-xs">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Supported formats info */}
      <div className="mt-4 flex items-center">
        <Info className="h-4 w-4 text-gray-400 mr-2" />
        <p className="text-xs text-gray-500">
          Supported formats: {supportedFormats.join(", ")} | Max file size:{" "}
          {maxFileSize}MB
        </p>
      </div>
    </div>
  );
};

export default UploadSection;
