
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
import { useAuth } from "@/context/AuthContext";
import { Video } from "@/lib/mock-data";
import {toast} from '@/components/ui/sonner'
import axios from "axios";
import { Switch } from "../ui/switch";
import { axiosClient } from "@/config/axiosConfig";
import { PLAYER_APP_URL } from "@/config";

interface VideoCardProps {
  video: Video;
  videoDeleted: (id: string) => void;
}

const VideoCard = ({ video, videoDeleted }: VideoCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const {user} = useAuth();
  const [isPublic, setIsPublic] = useState(video.isPublic);
  const getStatusColor = (status: Video["status"]) => {
    switch (status) {
      case "PENDING": return "text-status-pending";
      case "TRANSCODING": return "text-status-transcoding";
      case "COMPLETED": return "text-status-completed";
      case "FAILED": return "text-status-failed";
      default: return "text-muted-foreground";
    }
  };

  const handleShare = async() => {
    const promise = axiosClient.get(`/api/video/get-video-url/${video.id}`)
    .then(({data})=>{
      navigator.clipboard.writeText(data.data);
    })
    toast.promise(promise,{
      loading: "Fetching video URL",
      success:"Video URL copied to clipboard",
      error:"Failed to fetch video URL"
    });
  }
  const handleTest = async() => {
    const promise = axiosClient.get(`/api/video/get-video-url/${video.id}`)
    .then(({data})=>{
      window.open(`${PLAYER_APP_URL}/sample/${video.id}`, "_blank");
    })
    toast.promise(promise,{
      loading: "Opening test video",
      success:"Test video opened in new tab",
      error:"Failed to open test video"
    });
  }

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
      const deletePromise =  axiosClient.delete(`/api/video/delete-video/${video.id}`).then(()=>{
        if(videoDeleted) videoDeleted(video.id);
      })
      toast.promise(deletePromise, {
        loading: "Deleting video",
        success: "Video deleted successfully",
        error: "Failed to delete video",
      });
    } catch (error) {
      toast.error("Failed to delete video",{
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async() => {
    try {
      const togglePromise = axiosClient.get(`/api/video/toggle-visibility/${video.id}`).then(()=>{
        setIsPublic(value=>!value);
      })
      toast.promise(togglePromise, {
        loading: "Toggling video visibility",
        success: "Video visibility toggled successfully",
        error: "Failed to toggle video visibility",
      });
    } catch (error) {
      toast.error("Failed to toggle video visibility",{
        description: "Please try again.",
      });
    }
  }

  const handleEmbed = async()=>{
    const html = `<div className="max-w-[95vw] aspect-video">
      <iframe allowFullScreen className="w-full h-full" src="${PLAYER_APP_URL}/${video.id}" width={'100%'} height={'100%'}/>
      </div>`
    navigator.clipboard.writeText(html);
    toast.success("Code Copied to clipboard",{
      description: "Please paste the copied code in your website, where you want to embed the video.",
    });
  }



  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-40 bg-muted">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.name}
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
        {video.status === "TRANSCODING" && (
          <div className="absolute bottom-0 left-0 w-full bg-background bg-opacity-80 p-2">
            <Progress value={video.progress} className="h-2 w-full" />
            <p className="text-xs mt-1 text-center">{video.progress.toFixed(2)}% Complete</p>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate line-clamp-1 mr-1" title={video.name}>{video.name}</CardTitle>
          <span className={`text-sm font-medium ${getStatusColor(video.status)}`}>
            {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
          </span>
        </div>
        <CardDescription className="text-xs">
          Uploaded {formatDate(video.createdAt)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          { (user.roleInOrg === "OWNER" || user.roleInOrg === "VIEWER") && video.User&& `Uploaded by ${user.email === video.User.email ? "You" : `${video.User.name} (${video.User.email})`}`} 
        </p>
        
        {video.status === "COMPLETED" && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Available Formats</h4>
            <div className="grid grid-cols-2 gap-2">
              {video.variants?.map((format) => (
                <div key={format} className="border rounded p-2 text-xs">
                  <div className="font-medium">{format}</div>
                  {/* <div className="text-muted-foreground">{format.format}</div> */}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex justify-between w-full">
        {user?.roleInOrg == "OWNER" &&  <div className="flex items-center gap-2">
          <p>Private</p>
            <Switch onCheckedChange={handleToggleVisibility} checked={isPublic}/>
          <p>Public</p>
          </div>
}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {video.status === "COMPLETED" && (
                <>
                  <DropdownMenuItem onClick={handleEmbed}>Embed Code</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleShare}>Copy Link</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleTest}>Test in HLS Player</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              { user.roleInOrg !== "VIEWER" &&
              <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Video"}
              </DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
