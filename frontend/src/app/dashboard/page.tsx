"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

const mockVideos = [
  {
    id: 1,
    title: "Introduction to React",
    status: "COMPLETED",
    duration: "15:30",
    size: "245 MB",
    uploadedAt: "2024-01-15T10:30:00Z",
    thumbnail: "https://placehold.co/320x180/3b82f6/ffffff?text=React+Intro",
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    status: "TRANSCODING",
    duration: "28:45",
    size: "512 MB",
    uploadedAt: "2024-01-16T14:20:00Z",
    thumbnail: "https://placehold.co/320x180/10b981/ffffff?text=TypeScript",
  },
  {
    id: 3,
    title: "Next.js 14 Tutorial",
    status: "PENDING",
    duration: "42:15",
    size: "789 MB",
    uploadedAt: "2024-01-17T09:15:00Z",
    thumbnail: "https://placehold.co/320x180/8b5cf6/ffffff?text=Next.js",
  },
  {
    id: 4,
    title: "Database Design Principles",
    status: "UPLOADING",
    duration: "35:20",
    size: "623 MB",
    uploadedAt: "2024-01-18T16:45:00Z",
    thumbnail: "https://placehold.co/320x180/f59e0b/ffffff?text=Database",
  },
  {
    id: 5,
    title: "API Development Best Practices",
    status: "FAILED",
    duration: "25:10",
    size: "398 MB",
    uploadedAt: "2024-01-19T11:30:00Z",
    thumbnail: "https://placehold.co/320x180/ef4444/ffffff?text=API",
  },
  {
    id: 6,
    title: "Frontend Performance Optimization",
    status: "COMPLETED",
    duration: "38:55",
    size: "567 MB",
    uploadedAt: "2024-01-20T13:20:00Z",
    thumbnail: "https://placehold.co/320x180/06b6d4/ffffff?text=Performance",
  },
  {
    id: 7,
    title: "State Management with Redux",
    status: "TRANSCODING",
    duration: "31:40",
    size: "445 MB",
    uploadedAt: "2024-01-21T15:10:00Z",
    thumbnail: "https://placehold.co/320x180/ec4899/ffffff?text=Redux",
  },
  {
    id: 8,
    title: "Testing Strategies for React",
    status: "PENDING",
    duration: "22:30",
    size: "334 MB",
    uploadedAt: "2024-01-22T08:45:00Z",
    thumbnail: "https://placehold.co/320x180/84cc16/ffffff?text=Testing",
  },
  {
    id: 9,
    title: "Deployment and CI/CD",
    status: "UPLOADING",
    duration: "19:25",
    size: "289 MB",
    uploadedAt: "2024-01-23T12:00:00Z",
    thumbnail: "https://placehold.co/320x180/f97316/ffffff?text=Deployment",
  },
  {
    id: 10,
    title: "Security Best Practices",
    status: "FAILED",
    duration: "33:15",
    size: "456 MB",
    uploadedAt: "2024-01-24T10:15:00Z",
    thumbnail: "https://placehold.co/320x180/dc2626/ffffff?text=Security",
  },
  {
    id: 11,
    title: "Microservices Architecture",
    status: "COMPLETED",
    duration: "47:20",
    size: "678 MB",
    uploadedAt: "2024-01-25T14:30:00Z",
    thumbnail: "https://placehold.co/320x180/7c3aed/ffffff?text=Microservices",
  },
  {
    id: 12,
    title: "Cloud Infrastructure Setup",
    status: "TRANSCODING",
    duration: "26:45",
    size: "412 MB",
    uploadedAt: "2024-01-26T16:20:00Z",
    thumbnail: "https://placehold.co/320x180/0891b2/ffffff?text=Cloud",
  },
];

const statusOptions = ["ALL", "COMPLETED", "TRANSCODING", "PENDING", "UPLOADING", "FAILED"];

const statusColors = {
  COMPLETED: "bg-green-500",
  TRANSCODING: "bg-blue-500",
  PENDING: "bg-yellow-500",
  UPLOADING: "bg-purple-500",
  FAILED: "bg-red-500",
};

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 3;

  const filteredVideos = selectedStatus === "ALL" 
    ? mockVideos 
    : mockVideos.filter(video => video.status === selectedStatus);

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = filteredVideos.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatusString = (status: string) => status[0].toUpperCase() + status.slice(1).toLowerCase()

  return (
    <div className="min-h-screen bg-background">      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your video transcoding projects</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {formatStatusString(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentVideos.map((video) => (
            <div
              key={video.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[video.status as keyof typeof statusColors]}`}>
                  {video.status}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                  {video.title}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{video.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{video.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium">{formatDate(video.uploadedAt)}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    View Details
                  </button>
                  {video.status === "COMPLETED" && (
                    <button className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                      <Copy className="w-4 h-4" />
                      <p className="sr-only">Copy Link</p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md font-medium transition-colors ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {currentVideos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No videos found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedStatus === "ALL" 
                ? "You haven't uploaded any videos yet." 
                : `No videos with status "${selectedStatus}" found.`
              }
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Upload Your First Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
