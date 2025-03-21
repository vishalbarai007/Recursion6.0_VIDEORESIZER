import React, { useState, useCallback } from "react";
import { Upload, FileType, Info, AlertCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useVideoContext } from "./VideoContext";

// Define the API functions
interface UploadResult {
  success: boolean;
  error?: string;
  data?: {
    file_path: string;
  };
}

const uploadVideo = async (file: File, progressCallback: (progress: number) => void): Promise<UploadResult> => {
  // Mock implementation - replace with actual implementation
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressCallback(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ 
          success: true,
          data: {
            file_path: `/uploads/${file.name}` // Mock file path
          }
        });
      }
    }, 500);
  });
};

const uploadVideoFromUrl = async (url: string, progressCallback: (progress: number) => void): Promise<UploadResult> => {
  // Mock implementation - replace with actual implementation
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressCallback(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve({ 
          success: true,
          data: {
            file_path: url // Mock file path
          }
        });
      }
    }, 500);
  });
};

interface UploadSectionProps {
  onFileUpload?: (files: File[], filePath: string) => void; // Updated to include filePath
  onLinkUpload?: (url: string) => void;
  supportedFormats?: string[];
  maxFileSize?: number;
  isUploading?: boolean;
  uploadProgress?: number;
  setIsUploading?: (isUploading: boolean) => void;
  setUploadProgress?: (progress: number) => void;
}

const UploadSection = ({
  onFileUpload = () => {},
  onLinkUpload = () => {},
  supportedFormats = [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  maxFileSize = 500,
  isUploading = false,
  uploadProgress = 0,
  setIsUploading = () => {},
  setUploadProgress = () => {},
}: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("file");
  const [settings, setSettings] = useState({
    supportedFormats,
    maxFileSize,
  });

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
      if (!settings.supportedFormats.includes(extension)) {
        setError(
          `Unsupported file format: ${extension}. Please use: ${settings.supportedFormats.join(", ")}`,
        );
        continue;
      }

      // Check file size
      if (file.size > settings.maxFileSize * 1024 * 1024) {
        setError(
          `File too large: ${file.name}. Maximum size is ${settings.maxFileSize}MB`,
        );
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const validateUrl = (url: string): boolean => {
    setError(null);
    
    if (!url) {
      setError("Please enter a URL");
      return false;
    }
    
    try {
      new URL(url);
      return true;
    } catch (err) {
      setError("Please enter a valid URL");
      return false;
    }
  };


  // Get the context's setter for the video file path
  const { setVideoFilePath } = useVideoContext();


  // const handleUpload = async (validFiles: File[]) => {
  //   if (validFiles.length === 0) return;

  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   try {
  //     // Upload the first file
  //     const result = await uploadVideo(validFiles[0], (progress) => {
  //       setUploadProgress(progress);
  //     });

  //     if (result.error) {
  //       setError(result.error);
  //     } else {
  //       // Call the parent component's callback with the uploaded files and file path
  //       onFileUpload(validFiles, result.data.file_path);
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Upload failed");
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };


  const handleUpload = async (validFiles: File[]) => {
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload the first file
      const result = await uploadVideo(validFiles[0], (progress) => {
        setUploadProgress(progress);
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Save the video file path in context for global access
        setVideoFilePath(result.data.file_path);

        // Optionally call the parent's callback if needed
        onFileUpload(validFiles, result.data.file_path);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

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
    [onFileUpload, settings],
  );

  const handleLinkUpload = async () => {
    if (!validateUrl(videoUrl)) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadVideoFromUrl(videoUrl, (progress) => {
        setUploadProgress(progress);
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Call the parent component's callback with the uploaded link
        onLinkUpload(videoUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Link upload failed");
    } finally {
      setIsUploading(false);
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
    [onFileUpload, settings],
  );

  // const handleFileInputChange = useCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files.length > 0) {
  //       const validFiles = validateFiles(e.target.files);
  //       if (validFiles.length > 0) {
  //         setFiles(validFiles);
  //         handleUpload(validFiles);
  //       }
  //     }
  //   },
  //   [onFileUpload, settings],
  // );

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Upload Your Video</h2>

      <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file" disabled={isUploading}>Upload File</TabsTrigger>
          <TabsTrigger value="link" disabled={isUploading}>Upload via Link</TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          {/* Drag and drop area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
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
              accept={settings.supportedFormats.join(",")}
              onChange={handleFileInputChange}              multiple
              disabled={isUploading}
            />

            <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />

            {isUploading ? (
              <div className="text-center w-full">
                <p className="text-base sm:text-lg font-medium mb-2">Uploading...</p>
                <div className="w-full max-w-md mb-2 mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  {uploadProgress}% complete
                </p>
              </div>
            ) : (
              <>
                <p className="text-base sm:text-lg font-medium mb-1 sm:mb-2 text-center">
                  Drag & drop your video here
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 text-center">
                  or click to browse files
                </p>
                <Button variant="outline" className="mb-2 text-xs sm:text-sm">
                  <FileType className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Select Video
                  Files
                </Button>
              </>
            )}
          </div>

          {/* File information */}
          {files.length > 0 && !isUploading && (
            <div className="mt-4">
              <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                Selected Files:
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="text-xs sm:text-sm flex items-center p-1 sm:p-2 bg-gray-50 rounded-md overflow-hidden"
                  >
                    <FileType className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="font-medium mr-1 sm:mr-2 truncate">
                      {file.name}
                    </span>
                    <span className="text-gray-500 text-xs flex-shrink-0">
                      ({(file.size / (1024 * 1024)).toFixed(2)}{" "}
                      MB)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="link">
          <div className="border-2 border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex flex-col items-center">
              <LinkIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-2 sm:mb-4" />
              
              {isUploading ? (
                <div className="text-center w-full">
                  <p className="text-base sm:text-lg font-medium mb-2">Processing link...</p>
                  <div className="w-full max-w-md mb-2 mx-auto">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {uploadProgress}% complete
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-medium mb-2 sm:mb-4 text-center">
                    Paste a video URL
                  </p>
                  <div className="w-full max-w-md flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      className="flex-1 w-48"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <Button 
                      onClick={handleLinkUpload} 
                      disabled={!videoUrl}
                      className="w-full sm:w-auto"
                    >
                      Upload
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Supports videos from YouTube, Vimeo, and other popular platforms
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Show the link that was uploaded (when not uploading) */}
          {videoUrl && !isUploading && !error && (
            <div className="mt-4">
              <h3 className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                Video URL:
              </h3>
              <div className="text-xs sm:text-sm flex items-center p-1 sm:p-2 bg-gray-50 rounded-md">
                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="font-medium text-blue-600 hover:underline truncate">
                  {videoUrl}
                </span>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Error message (shared between tabs) */}
      {error && (
        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mr-1 sm:mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Supported formats info (shared between tabs) */}
      <div className="mt-3 sm:mt-4 flex items-center">
        <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-1 sm:mr-2 flex-shrink-0" />
        <p className="text-xs text-gray-500">
          Supported formats: {settings.supportedFormats.join(", ")} | Max file
          size: {settings.maxFileSize}MB
        </p>
      </div>
    </div>
  );
};

export default UploadSection;