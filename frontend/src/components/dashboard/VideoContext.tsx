import React, { createContext, useState, useContext } from "react";

interface VideoContextType {
  videoFilePath: string | null;
  setVideoFilePath: (path: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoFilePath, setVideoFilePath] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ videoFilePath, setVideoFilePath }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }
  return context;
};
