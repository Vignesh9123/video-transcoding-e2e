
export type VideoStatus = "UPLOADING" | "PENDING" | "TRANSCODING"| "COMPLETED" | "FAILED";

export interface VideoFormat {
  id: string;
  format: string;
  resolution: string;
  url: string;
  size: string;
}

export interface Video {
  id: string;
  name: string;
  description: string;
  status: VideoStatus;
  progress?: number;
  url ?: string;
  thumbnail?: string;
  duration?: string;
  createdAt: string;
  User:{
    name: string;
    email: string;
  },
  variants?: string[];
  isPublic: boolean;
  // formats?: VideoFormat[];
}

// export const mockVideos: Video[] = [
//   {
//     id: "1",
//     name: "Conference Keynote Presentation",
//     description: "Annual company keynote highlighting new product features and roadmap.",
//     status: "COMPLETED",
//     thumbnail: "https://images.unsplash.com/photo-1521464302861-ce943915d1c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     duration: "00:32:15",
//     createdAt: "2023-10-25T14:48:00.000Z",
//     // formats: [
//     //   { id: "1-1", format: "mp4", resolution: "1080p", url: "#", size: "1.2 GB" },
//     //   { id: "1-2", format: "mp4", resolution: "720p", url: "#", size: "850 MB" },
//     //   { id: "1-3", format: "mp4", resolution: "480p", url: "#", size: "500 MB" },
//     //   { id: "1-4", format: "m3u8", resolution: "Adaptive", url: "#", size: "Streaming" },
//     // ],
//     User: {
//       name: "John Doe",
//       email: "o9E0U@example.com"
//     }
//   },
//   {
//     id: "2",
//     name: "Product Demo Video",
//     description: "Detailed walkthrough of our software's new features.",
//     status: "TRANSCODING",
//     progress: 65,
//     thumbnail: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     duration: "00:12:30",
//     createdAt: new Date().toISOString(), // Just uploaded
//     User: {
//       name: "John Doe",
//       email: "o9E0U@example.com"
//     }
//   },
//   {
//     id: "3",
//     name: "Team Building Event",
//     description: "Highlights from our recent team retreat in the mountains.",
//     status: "PENDING",
//     thumbnail: "https://images.unsplash.com/photo-1522071901873-411886a10004?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
//     User: {
//       name: "John Doe",
//       email: "o9E0U@example.com"
//     }
//   },
//   {
//     id: "4",
//     name: "Customer Testimonial - Enterprise Solutions",
//     description: "Interview with the CTO of Acme Corp about their experience with our platform.",
//     status: "COMPLETED",
//     thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     duration: "00:08:42",
//     createdAt: "2023-10-20T09:15:00.000Z",
//     // formats: [
//     //   { id: "4-1", format: "mp4", resolution: "1080p", url: "#", size: "720 MB" },
//     //   { id: "4-2", format: "mp4", resolution: "720p", url: "#", size: "450 MB" },
//     //   { id: "4-3", format: "mp4", resolution: "480p", url: "#", size: "250 MB" },
//     // ],
//     User: {
//       name: "John Doe",
//       email: "o9E0U@example.com"
//     }
//   },
//   {
//     id: "5",
//     name: "Tutorial: Advanced Analytics Features",
//     description: "Step-by-step guide on how to use our advanced analytics dashboard features.",
//     status: "FAILED",
//     createdAt: "2023-10-18T11:20:00.000Z",
//     User: {
//       name: "John Doe",
//       email: "o9E0U@example.com"
//     }
//   },
//   {
//     id: "6",
//     name: "Company All-Hands Meeting - Q3",
//     description: "Quarterly company update with department reports and financial overview.",
//     status: "COMPLETED",
//     thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
//     duration: "00:45:18",
//     createdAt: "2023-10-15T15:30:00.000Z",
//     // formats: [
//     //   { id: "6-1", format: "mp4", resolution: "1080p", url: "#", size: "1.5 GB" },
//     //   { id: "6-2", format: "mp4", resolution: "720p", url: "#", size: "950 MB" },
//     //   { id: "6-3", format: "m3u8", resolution: "Adaptive", url: "#", size: "Streaming" },
//     // ],
//     User: {
//       name: "John Doe",
//       email: "o9E0U@example.com"
//     }
//   },
// ];
