
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Video } from "@/lib/mock-data";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const getStatusColor = (status: Video["status"]) => {
    switch (status) {
      case "pending": return "text-status-pending";
      case "transcoding": return "text-status-transcoding";
      case "completed": return "text-status-completed";
      case "failed": return "text-status-failed";
      default: return "text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: "Video deleted",
        description: "Video has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResendEmail = () => {
    toast({
      title: "Notification resent",
      description: "Email notification has been sent.",
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-40 bg-muted">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {video.status === "transcoding" && (
          <div className="absolute bottom-0 left-0 w-full bg-background bg-opacity-80 p-2">
            <Progress value={video.progress} className="h-2 w-full" />
            <p className="text-xs mt-1 text-center">{video.progress}% Complete</p>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate" title={video.title}>{video.title}</CardTitle>
          <span className={`text-sm font-medium ${getStatusColor(video.status)}`}>
            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
          </span>
        </div>
        <CardDescription className="text-xs">
          Uploaded {formatDate(video.uploadedAt)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {video.description || "No description provided"}
        </p>
        
        {video.status === "completed" && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Available Formats</h4>
            <div className="grid grid-cols-2 gap-2">
              {video.formats?.map((format) => (
                <div key={format.id} className="border rounded p-2 text-xs">
                  <div className="font-medium">{format.resolution}</div>
                  <div className="text-muted-foreground">{format.format}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
          {video.status === "completed" ? (
            <Button variant="outline" size="sm" onClick={handleResendEmail}>
              Resend Email
            </Button>
          ) : video.status === "failed" ? (
            <Button variant="outline" size="sm">
              Retry
            </Button>
          ) : (
            <div />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {video.status === "completed" && (
                <>
                  <DropdownMenuItem>Download All</DropdownMenuItem>
                  <DropdownMenuItem>Share Video</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Video"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
