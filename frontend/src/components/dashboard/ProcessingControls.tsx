import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Download, Share2, Cloud, Play, Settings, Layers } from "lucide-react";
import { processVideo } from "@/lib/api";

interface ProcessingControlsProps {
	onProcess?: () => void;
	onBatchProcess?: () => void;
	onDownload?: () => void;
	onShare?: () => void;
	onSaveToCloud?: () => void;
	isProcessing?: boolean;
	isVideoUploaded?: boolean;
	setIsProcessing?: (isProcessing: boolean) => void;
	processingProgress?: number;
	setProcessingProgress?: (progress: number) => void;
	selectedPlatform?: string;
	platformSettings?: any;
	videoId?: string;
	videoFilePath?: string; // Add videoFilePath to props
}

const ProcessingControls = ({
	onProcess = () => {},
	onBatchProcess = () => {},
	onDownload = () => {},
	onShare = () => {},
	onSaveToCloud = () => {},
	isProcessing = false,
	isVideoUploaded = true,
	setIsProcessing = () => {},
	processingProgress = 0,
	setProcessingProgress = () => {},
	selectedPlatform = "youtube",
	platformSettings = {},
	videoId = "",
	videoFilePath = "", // Add videoFilePath to props
}: ProcessingControlsProps) => {
	const [isProcessed, setIsProcessed] = useState(false);
	const [processedVideoPath, setProcessedVideoPath] = useState(""); // Store the processed video path

	useEffect(() => {
		if (processingProgress >= 100) {
			setIsProcessed(true);
		}
	}, [processingProgress]);

	// Handle video processing with the Flask backend
	const handleProcess = async () => {
		if (!isVideoUploaded || !videoFilePath) return;

		setIsProcessing(true);
		setProcessingProgress(0);
		setIsProcessed(false);

		try {
			// Prepare processing settings
			const settings = {
				format: "mp4", // Default format
				aspect_ratio: platformSettings.aspectRatio || "16:9", // Default aspect ratio
				auto_caption: platformSettings.autoCaption || false, // Default auto-captioning
				resolution: platformSettings.resolution || "100%", // Default resolution
			};

			// Call the API to process the video
			const result = await processVideo(
				videoFilePath, // Pass the video file path
				settings,
				(progress) => {
					setProcessingProgress(progress);
				},
			);

			if (result.error) {
				console.error("Processing error:", result.error);
			} else {
				// Update the processed video path
				setProcessedVideoPath(result.data.output_path);
				// Call the parent component's callback
				onProcess();
			}
		} catch (err) {
			console.error("Processing error:", err);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleDownload = () => {
		if (processedVideoPath) {
			// Trigger download of the processed video
			const link = document.createElement("a");
			link.href = processedVideoPath;
			link.download = `processed_video_${videoId}.mp4`;
			link.click();
		} else {
			alert("No processed video available for download.");
		}
	};

	const handleShare = () => {
		if (processedVideoPath) {
			// In a real implementation, this would open a share dialog
			onShare();
			alert(
				`Share dialog would open here. Processed video URL: ${processedVideoPath}`,
			);
		} else {
			alert("No processed video available for sharing.");
		}
	};

	const handleSaveToCloud = () => {
		if (processedVideoPath) {
			// In a real implementation, this would save to cloud storage
			onSaveToCloud();
			alert(
				`Saving to cloud! Processed video URL: ${processedVideoPath}`,
			);
		} else {
			alert("No processed video available to save to cloud.");
		}
	};

	return (
		<div className="w-full p-6 bg-white rounded-lg shadow-sm border border-gray-100">
			<div className="flex flex-col space-y-4">
				{/* Main processing controls */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={handleProcess}
										disabled={
											!isVideoUploaded || isProcessing
										}
										className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
										size="lg"
									>
										<Play size={16} />
										{isProcessing
											? "Processing..."
											: "Process Video"}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>
										Process the video with current settings
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={onBatchProcess}
										variant="outline"
										className="flex items-center gap-2"
										disabled={
											!isVideoUploaded || isProcessing
										}
									>
										<Layers size={16} />
										Batch Process
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Process multiple videos at once</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center gap-2"
										disabled={
											!isVideoUploaded || isProcessing
										}
									>
										<Settings size={16} />
										Advanced Settings
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Configure advanced processing options</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className="flex items-center space-x-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={handleDownload}
										variant="secondary"
										className="flex items-center gap-2"
										disabled={!isProcessed}
									>
										<Download size={16} />
										Download
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Download processed video</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={handleShare}
										variant="secondary"
										className="flex items-center gap-2"
										disabled={!isProcessed}
									>
										<Share2 size={16} />
										Share
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share processed video</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										onClick={handleSaveToCloud}
										variant="secondary"
										className="flex items-center gap-2"
										disabled={!isProcessed}
									>
										<Cloud size={16} />
										Save to Cloud
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Save to cloud storage</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>

				{/* Processing progress bar */}
				{isProcessing || processingProgress > 0 ? (
					<div className="w-full mt-4">
						<div className="flex justify-between text-sm text-gray-600 mb-1">
							<span>Processing video...</span>
							<span>{processingProgress}%</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5">
							<div
								className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
								style={{ width: `${processingProgress}%` }}
							></div>
						</div>
						<p className="text-xs text-gray-500 mt-2">
							{processingProgress < 100
								? `AI is optimizing your video for ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}...`
								: "Processing complete! Your video is ready."}
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default ProcessingControls;
