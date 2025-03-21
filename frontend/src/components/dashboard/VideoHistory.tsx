import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Download,
  MoreVertical,
  Play,
  Share2,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { getUserVideos, deleteVideo } from "@/lib/api";

interface VideoHistoryItem {
  id: string;
  name: string;
  platform: string;
  date: string;
  status: "completed" | "processing" | "failed";
  thumbnail: string;
  duration: string;
  size: string;
}

interface VideoHistoryProps {
  videos?: VideoHistoryItem[];
  onPlay?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  refreshTrigger?: number;
}

const VideoHistory = ({
  videos: initialVideos,
  onPlay = () => {},
  onDownload = () => {},
  onShare = () => {},
  onDelete = () => {},
  onEdit = () => {},
  refreshTrigger = 0,
}: VideoHistoryProps) => {
  const [videos, setVideos] = useState<VideoHistoryItem[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getUserVideos();
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setVideos(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [refreshTrigger]);

  const toggleSelectVideo = (id: string) => {
    setSelectedVideos((prev) =>
      prev.includes(id)
        ? prev.filter((videoId) => videoId !== id)
        : [...prev, id],
    );
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const result = await deleteVideo(id);
      if (result.error) {
        setError(result.error);
      } else {
        // Remove the video from the list
        setVideos((prev) => prev.filter((video) => video.id !== id));
        // Remove from selected videos if it was selected
        setSelectedVideos((prev) => prev.filter((videoId) => videoId !== id));
        // Call the parent component's callback
        onDelete(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
    }
  };

  const handleDeleteSelected = async () => {
    for (const id of selectedVideos) {
      await handleDeleteVideo(id);
    }
    setSelectedVideos([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Video History</h2>
        <div className="flex gap-2">
          {selectedVideos.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600">
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedVideos(videos.map((v) => v.id));
                    } else {
                      setSelectedVideos([]);
                    }
                  }}
                  checked={
                    selectedVideos.length === videos.length && videos.length > 0
                  }
                />
              </TableHead>
              <TableHead className="w-[250px]">Video</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedVideos.includes(video.id)}
                    onChange={() => toggleSelectVideo(video.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-20 rounded overflow-hidden bg-gray-100">
                      <img
                        src={video.thumbnail}
                        alt={video.name}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={() => onPlay(video.id)}
                      >
                        <Play className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                    <span className="font-medium truncate max-w-[150px]">
                      {video.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {video.platform}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(video.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(video.status)}
                    <span className="capitalize">{video.status}</span>
                  </div>
                </TableCell>
                <TableCell>{video.duration}</TableCell>
                <TableCell>{video.size}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDownload(video.id)}
                      disabled={video.status !== "completed"}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onShare(video.id)}
                      disabled={video.status !== "completed"}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(video.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {videos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  {isLoading
                    ? "Loading videos..."
                    : "No videos in history yet. Upload a video to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {videos.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div>Showing {videos.length} videos</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHistory;
