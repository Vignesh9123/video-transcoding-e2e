# StreamForge

**StreamForge** is a scalable, modular, and event-driven video transcoding platform built using AWS services, FFmpeg, and Docker. It enables users to upload videos via a web interface, which are then automatically processed into adaptive bitrate formats (HLS) for smooth playback across devices and networks.

---
## Architecture Design

<img width="1649" height="796" alt="image" src="https://github.com/user-attachments/assets/bf636c24-ed3c-4843-80e7-2cc385f8ebb7" />

---
## 📁 Folder Structure

```
.
├── frontend                  # React + TailwindCSS app for video uploads and playback
├── poller                   # SQS polling service that validates and triggers processing
├── primary-backend          # Express.js API server (auth, role control, presigned URLs)
├── progress-tracker         # WebSocket service for real-time video transcoding progress updates using Redis PubSub
├── video-transcoding-container # Dockerized FFmpeg processor handling video segmentation
├── .gitignore

```

---

## 🌐 System Overview

**How it works:**

1. **Upload**: Users upload videos via the frontend using presigned S3 URLs.
2. **Trigger**: S3 upload triggers an event → SQS message is sent.
3. **Polling**: The `poller` service listens to SQS, validates events.
4. **Processing**: Upon validation, a Docker container (in `video-transcoding-container`) is launched in a Fargate orchestrated by ECS.
5. **Progress**: Real-time progress updates are sent to the `progress-tracker` service via Redis PubSub. `progress-tracker` uses WebSockets to notify the frontend of transcoding status.
5. **Output**: FFmpeg segments video into `.ts` chunks and `.m3u8` playlists → pushed to main S3 bucket.
6. **Playback**: Frontend streams the video using HLS via a video player.

---

## 🛠 Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | ReactJS, TailwindCSS |
| Backend API | Node.js, Express, Prisma ORM |
| Polling Engine | Node.js, AWS SDK |
| Video Processing | FFmpeg in Docker |
| Real-time Updates | Redis PubSub, WebSockets |
| Database | PostgreSQL |
| Cloud Infra | AWS S3, SQS, ECS (or Fargate), IAM |

---

## 🔐 Role-Based Access Control (RBAC)

The system includes organization-specific role segregation:

- **Owner**: Full access, can manage editors/viewers and toggle visibility of videos.
- **Editor**: Can upload and view all public videos + their own uploads.
- **Viewer**: Can only see public videos within their organization.

---

## ⚙️ Key Features

- Secure, direct-to-S3 uploads with presigned URLs.
- Adaptive streaming with HLS (.m3u8 + .ts).
- Event-driven backend via SQS queue.
- Isolated, container-based video processing with FFmpeg.
- Role-based content access (Owner/Editor/Viewer).
- Progress updates and error handling for each video job.
- Easily extensible pipeline for future enhancements (e.g., live streaming, analytics, watermarking).

---

## 📈 Test Results & Performance

StreamForge was tested across multiple videos and compute environments:

- Handled uploads from short 2-minute clips to 75-minute HD content.
- Efficient segment generation across resolutions (360p, 480p, 720p, etc).
- Processing scales horizontally using container-based architecture.
- Cold start latency observed during initial container spin-up.
- Clean error handling and recovery for failed transcodes.

---

## 🧩 Future Roadmap

- Live streaming via RTMP/WebRTC.
- CDN integration for global video delivery.
- User-configurable encoding settings.
- Viewer analytics dashboards.
- DRM + Watermarking for content protection.
- ML-based moderation and thumbnail generation.

