
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoCard from "./VideoCard";
import { mockVideos, Video } from "@/lib/mock-data";

const statusFilters = ["all", "pending", "transcoding", "completed", "failed"] as const;
type StatusFilter = typeof statusFilters[number];

const VideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Simulate API fetch
        await new Promise((resolve) => setTimeout(resolve, 800));
        setVideos(mockVideos);
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

    const interval = setInterval(() => {
      setVideos((currentVideos) =>
        currentVideos.map((video) => {
          if (video.status === "pending") {
            return { ...video, status: "transcoding", progress: 10 };
          }
          if (video.status === "transcoding") {
            const newProgress = (video.progress || 0) + 10;
            if (newProgress >= 100) {
              return { ...video, status: "completed", progress: 100 };
            }
            return { ...video, progress: newProgress };
          }
          return video;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredVideos = videos.filter(
    (video) => activeFilter === "all" || video.status === activeFilter
  );

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
        <Button asChild>
          <Link to="/upload">Upload New Video</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={(v) => setActiveFilter(v as StatusFilter)}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="transcoding">Transcoding</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="mt-0">
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No videos found</p>
                <Button asChild>
                  <Link to="/upload">Upload Your First Video</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoList;
