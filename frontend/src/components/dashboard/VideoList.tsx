import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoCard from "./VideoCard";
import { Video, VideoStatus } from "@/lib/mock-data";
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";
import { Input } from "../ui/input";

const statusFilters = ["all", "UPLOADING", "PENDING", "TRANSCODING", "FAILED", "COMPLETED"] as const;
type StatusFilter = typeof statusFilters[number];

const VideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {user} = useAuth();
  const [socket , setSocket] = useState<WebSocket | null>(null);
  const [subscribedVideos, setSubscribedVideos] = useState<string[]>([]);
  // const getVideoStatuses = useCallback(async () => {
  //   const videoIds = videos
  //     .filter((vid) => vid.status === "TRANSCODING" || vid.status === "PENDING" || vid.status === "UPLOADING")
  //     .map((vid) => vid.id);
    
  //   console.log("Getting video statuses for", videoIds);

  //   if (videoIds.length === 0) return;

  //   try {
  //     const { data } = await axios.post('http://localhost:3000/api/video/get-video-status/bulk', { videoIds }, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       withCredentials: true
  //     });

  //     const responseData: {
  //       status: VideoStatus;
  //       progress: number;
  //       videoId: string;
  //     }[] = data.data;

  //     setVideos((prevVideos) =>
  //       prevVideos.map((video) => {
  //         const updated = responseData.find((v) => v.videoId === video.id);
  //         if (updated) {
  //           return { ...video, status: updated.status, progress: updated.progress };
  //         } else {
  //           return video;
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Failed to update video statuses", error);
  //   }
  // }, [videos]); // Dependency on videos


  const deleteVideo = (videoId: string) => {
    console.log("Deleting video", videoId);
    setVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
  }



  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const userVideos = await axios.get("http://localhost:3000/api/video/get-videos", {
          withCredentials: true
        });
        console.log("Response", userVideos.data);
        setVideos(userVideos.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load videos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();

    const scket = new WebSocket(`ws://localhost:9090?token=${localStorage.getItem("token")}`);
    setSocket(scket);
    return () => {
      scket.close();
      if(socket) socket.close();
    }
  }, []); 

  useEffect(()=>{
    if(!socket || socket.readyState !== WebSocket.OPEN) return;
    const transcodingVideos = videos.filter((video) => video.status !== "COMPLETED" && video.status !== "FAILED");
    const transcodingVideoIds = transcodingVideos.map((video) => video.id);
    transcodingVideoIds.forEach((videoId) => {
      if(subscribedVideos.includes(videoId)) return;
      socket.send(JSON.stringify({
        type: "SUBSCRIBE",
        videoId: videoId
      }))
      setSubscribedVideos((prev) => [...prev, videoId])
    })
  }, [videos])

  useEffect(()=>{
    if(!socket) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      console.log(data)
      const video = videos.find((video) => video.id == data.videoId);
      if(!video){
        console.log("Video not found");
        return
      }
      setVideos((prevVideos) => prevVideos.map((v) => {
        if(v.id === video.id) return {
          ...v,
          status: data.status,
          progress: data.progress
        }
        return v;
      }))
      if(data.status === "COMPLETED" || data.status === "FAILED") {
        setSubscribedVideos((prev) => prev.filter((id) => id !== video.id));
      }
    }
    return () => {
      socket.onmessage = null;
    }
  }, [socket, videos])

  useEffect(() => {
    if(searchQuery === '') setFilteredVideos(videos);
    else setFilteredVideos(videos.filter((video) => video.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getVideoStatuses();
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [getVideoStatuses]); 
  useEffect(() => {
    setFilteredVideos(
      videos.filter((video) => activeFilter === "all" || video.status === activeFilter)
    );
  }, [activeFilter, videos]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6">
            <div className="h-2 bg-muted rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-muted rounded col-span-2"></div>
                <div className="h-2 bg-muted rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Your Videos</h2>
        {user.roleInOrg != "VIEWER" && <Button asChild>
          <Link to="/upload">Upload New Video</Link>
        </Button>}
      </div>

      <div className="flex items-center space-x-2">
        <Input placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={(v) => setActiveFilter(v as StatusFilter)}>
        <TabsList className="grid h-auto grid-cols-3 md:grid-cols-5 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="TRANSCODING">Transcoding</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
          <TabsTrigger value="FAILED">Failed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="mt-0">
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} videoDeleted={deleteVideo} />
              ))}
            </div>
          ) : activeFilter == "all" ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No videos found</p>
                <Button asChild>
                  <Link to="/upload">Upload Your First Video</Link>
                </Button>
              </CardContent>
            </Card>
          )
          :
          (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No videos found</p>
              </CardContent>
            </Card>
          )
        }
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoList;