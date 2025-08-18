"use client";

import { useState, useRef } from "react";

export default function Upload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Here you would implement the actual upload logic
    // For now, we'll just simulate it
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Upload Video</h1>
            <p className="text-muted-foreground">Upload your video files for transcoding</p>
          </div>

          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-6xl mb-4">📹</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Drop your video here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {selectedFile && (
            <div className="mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">File Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Filename:</span>
                    <span className="font-medium text-card-foreground">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium text-card-foreground">{formatFileSize(selectedFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium text-card-foreground">{selectedFile.type}</span>
                  </div>
                </div>

                {isUploading && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {!isUploading && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={handleUpload}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Start Upload
                    </button>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Remove File
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Upload Guidelines</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-card-foreground mb-2">Supported Formats</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• MP4 (H.264, H.265)</li>
                  <li>• MOV (ProRes, H.264)</li>
                  <li>• AVI (XviD, DivX)</li>
                  <li>• MKV (H.264, H.265)</li>
                  <li>• WebM (VP8, VP9)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-card-foreground mb-2">File Requirements</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Maximum file size: 10 GB</li>
                  <li>• Resolution: Up to 4K (3840x2160)</li>
                  <li>• Frame rate: Up to 60 fps</li>
                  <li>• Audio: AAC, MP3, AC3</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-medium text-card-foreground mb-2">💡 Pro Tips</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• For best quality, upload original source files</li>
                <li>• Ensure stable internet connection for large files</li>
                <li>• Processing time depends on video length and quality</li>
                <li>• You can upload multiple files simultaneously</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}
