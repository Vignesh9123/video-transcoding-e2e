import { useState, useEffect, useCallback, useRef } from "react";
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
import { axiosClient } from "@/config/axiosConfig";
import { WS_URL } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Command } from "lucide-react";

const statusFilters = ["all", "UPLOADING", "PENDING", "TRANSCODING", "FAILED", "COMPLETED"] as const;
type StatusFilter = typeof statusFilters[number];

const VideoList = () => {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const {user} = useAuth();
  const [socket , setSocket] = useState<WebSocket | null>(null);
  const [subscribedVideos, setSubscribedVideos] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 6;


  const {data : videosResponse , isLoading: isUserVideosLoading } = useQuery({
    queryKey: [`videos`,page],
    queryFn: async () => {
      const userVideos = await axiosClient.get("/api/video/get-videos", {
        params: {
          page,
          limit
        }
      });
      console.log("Response", userVideos.data);
      return userVideos.data.data
    },
    refetchOnWindowFocus: true,
    staleTime: Infinity // TODO: This is because of the websocket progress updates
  })

  const userVideos = videosResponse?.videos || [];
  const totalVideos = videosResponse?.pagination.totalVideosCount || 0;
  const deleteVideo = async(videoId: string) => {
    console.log("Deleting video", videoId);
    const oldVideos: Video[] = queryClient.getQueryData([`videos`, page]);
    const newVideos = oldVideos?.filter((video: Video) => video.id !== videoId);
    queryClient.setQueryData([`videos`, page], newVideos);
  }



  useEffect(() => {
    const scket = new WebSocket(`${WS_URL}/?token=${localStorage.getItem("token")}`);
    setSocket(scket);
    return () => {
      scket.close();
      if(socket) socket.close();
    }
  }, []); 

  useEffect(()=>{
    if(!socket || socket.readyState !== WebSocket.OPEN || isUserVideosLoading) return;
    console.log("User videos subsc", userVideos);
    const transcodingVideos = userVideos.filter((video) => video.status !== "COMPLETED" && video.status !== "FAILED");
    console.log("Transcoding videos", transcodingVideos);
    const transcodingVideoIds = transcodingVideos.map((video) => video.id);
    console.log("Transcoding videos", transcodingVideoIds);
    transcodingVideoIds.forEach((videoId) => {
      if(subscribedVideos.includes(videoId)) return;
      console.log("Subscribing to video", videoId);
      socket.send(JSON.stringify({
        type: "SUBSCRIBE",
        videoId: videoId
      }))
      setSubscribedVideos((prev) => [...prev, videoId])
    })
  }, [userVideos,socket, isUserVideosLoading])

  useEffect(()=>{
    if(!socket) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data.toString());
      console.log(data)
      const video = userVideos.find((video) => video.id == data.videoId);
      if(!video){
        console.log("Video not found");
        return
      }
      queryClient.setQueryData([`videos`, page],(prevVideos: Video[]) => prevVideos.map((v) => {
        if(v.id === video.id) return {
          ...v,
          status: data.status,
          progress: data.progress
        }
        return v;
      }))
      if(data.status === "COMPLETED" || data.status === "FAILED") {
        setSubscribedVideos((prev) => prev.filter((id) => id !== video.id));
        socket.send(JSON.stringify({
          type: "UNSUBSCRIBE",
          videoId: video.id
        }))
      }
    }
    return () => {
      socket.onmessage = null;
    }
  }, [socket, userVideos])

  const searchRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      searchRef.current?.focus();
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  },[])

  useEffect(() => {
    window.scrollTo({top:100, behavior: "smooth" });
  }, [page]);
  
  if (isUserVideosLoading) {
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

  const filteredVideos = userVideos
  .filter((video) => video.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
  .filter((video) => activeFilter === "all" || video.status === activeFilter)
  
  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Your Videos</h2>
        {user.roleInOrg != "VIEWER" && <Button className="flex items-center"  asChild>
          <Link to="/upload"><div className="text-lg mb-[3px]">+</div><div>New Video</div></Link>
        </Button>}
      </div>

      <div className="flex items-center space-x-2 relative">
        <Input ref={searchRef} placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className="absolute right-1 flex gap-1 items-center justify-center bg-muted text-muted-foreground p-1 rounded">
          <Command size={16}/>
          <p className="text-sm">
            K
          </p>
        </div>
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
                <VideoCard  key={video.id} video={video} videoDeleted={deleteVideo} />
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

      <div className="flex flex-row justify-center items-center gap-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <p className="text-sm">Page {page} of {Math.ceil(totalVideos / limit) }</p>
        <Button onClick={() => setPage(page + 1)} disabled={page === Math.ceil(totalVideos / limit)}>Next</Button>
      </div>
    </div>
  );
};

export default VideoList;