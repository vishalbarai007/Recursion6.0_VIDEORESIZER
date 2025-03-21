import React, { useState } from "react";
import { Helmet } from "react-helmet";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import UploadSection from "../components/dashboard/UploadSection";
import VideoPreview from "../components/dashboard/VideoPreview";
import PlatformTabs from "../components/dashboard/PlatformTabs";
import ProcessingControls from "../components/dashboard/ProcessingControls";
import VideoHistory from "../components/dashboard/VideoHistory";

interface PlatformSettings {
  aspectRatio: string;
  resolution: string;
  quality: number;
  autoCaption: boolean;
  customSettings: Record<string, any>;
}

const Dashboard = () => {
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    aspectRatio: "16:9",
    resolution: "1920x1080",
    quality: 80,
    autoCaption: false,
    customSettings: {
      endScreen: true,
      annotations: false,
    },
  });

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setIsVideoUploaded(true);
      // In a real implementation, this would upload the file to a server
      console.log("Files uploaded:", files);
    }
  };

  // Handle video processing
  const handleProcessVideo = () => {
    setIsProcessing(true);
    // In a real implementation, this would send the video for processing
    // After processing is complete, setIsProcessing(false) would be called
    setTimeout(() => {
      setIsProcessing(false);
    }, 5000);
  };

  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
  };

  // Handle settings change
  const handleSettingsChange = (settings: PlatformSettings) => {
    setPlatformSettings(settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Dashboard | VideoAI Resizer</title>
      </Helmet>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar activePath="/dashboard" />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader />

          {/* Main dashboard area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Upload section */}
              <UploadSection
                onFileUpload={handleFileUpload}
                isUploading={isProcessing}
              />

              {/* Video preview and platform settings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video preview - takes up 2/3 of the space on large screens */}
                <div className="lg:col-span-2">
                  <VideoPreview
                    aspectRatio={platformSettings.aspectRatio}
                    isProcessing={isProcessing}
                  />
                </div>

                {/* Platform tabs - takes up 1/3 of the space on large screens */}
                <div>
                  <PlatformTabs
                    selectedPlatform={selectedPlatform}
                    settings={platformSettings}
                    onPlatformChange={handlePlatformChange}
                    onSettingsChange={handleSettingsChange}
                  />
                </div>
              </div>

              {/* Processing controls */}
              <ProcessingControls
                onProcess={handleProcessVideo}
                isProcessing={isProcessing}
                isVideoUploaded={isVideoUploaded}
              />

              {/* Video history */}
              <VideoHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
