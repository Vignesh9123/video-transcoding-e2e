
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FormatSelection from "./FormatSelection";
import ResolutionSelection from "./ResolutionSelection";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "../ui/progress";
import ProgressDialogBox from "./ProgressDialogBox";
import axios from "axios";
import { Switch } from "../ui/switch";
import { useAuth } from "@/context/AuthContext";
import { axiosClient } from "@/config/axiosConfig";

interface UploadFormProps {
  onFileChange: (file: File | null) => void;
  uploadedFile: File | null;
}

const UploadForm = ({ onFileChange, uploadedFile }: UploadFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["mp4"]);
  const [selectedResolutions, setSelectedResolutions] = useState<string[]>(["360p", "480p","720p"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your video",
        variant: "destructive",
      });
      return false;
    }

    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload",
        variant: "destructive",
      });
      return false;
    }

    // if (selectedFormats.length === 0) {
    //   toast({
    //     title: "No format selected",
    //     description: "Please select at least one output format",
    //     variant: "destructive",
    //   });
    //   return false;
    // }

    if (selectedResolutions.length === 0) {
      toast({
        title: "No resolution selected",
        description: "Please select at least one resolution",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  function uploadToS3PresignedUrl(file: File, presignedUrl: string, key: string): Promise<void> {
    return new Promise(async(resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', presignedUrl);
    const arrayBuffer = await file.arrayBuffer();
    
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.setRequestHeader('key', key)
    
    xhrRef.current = xhr;
    
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(`Upload Progress: ${percentComplete.toFixed(2)}%`);
        setProgress(percentComplete)
      }
    };
    
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Upload successful!');
        resolve();
      } else {
        reject(new Error('Upload failed with status ' + xhr.status));
      }
    };
    
    xhr.onerror = function () {
      reject(new Error('Network error'));
    };
    xhr.upload.onabort = function () {
      reject(new Error('Upload aborted'));
    };
    
    xhr.send(arrayBuffer);
    });
  }

    const abortUpload = () => {
      if (xhrRef.current) {
        xhrRef.current.abort();
        xhrRef.current = null;
        setOpen(false);
        setIsSubmitting(false);
        setProgress(0);
      }
    }

    
    
    const uploadHandler = async(e: React.FormEvent) => {
      e.preventDefault();
      if(!validateForm()) return
      try {
        if (!uploadedFile) return
        setOpen(true)
        setIsSubmitting(true)
        const res = await axiosClient.post('/api/video/get-presigned-url', {name: title || uploadedFile.name, isPublic, selectedResolutions})
        const {signedUrl, key} = res.data
        console.log('signedUrl', signedUrl)
        // const url = new URL(signedUrl)
        // console.log('url', url)
        // const params = Object.fromEntries(url.searchParams)
        // const formData = new FormData()
        
        // formData.append('Content-Type', uploadedFile.type)
        // formData.append('key', key)
        // formData.append('file', uploadedFile)
        // Object.entries(params).forEach(([key, value]) => {
        //   formData.append(key, value)
        // })
  
        // console.log('formData', formData)
        // const res2 = await fetch(url.origin, {
        //   method: "POST",
        //   body: formData
        // })
        // console.log('res2', res2)
        // if (!res2.ok) {
        //   throw new Error("Failed to upload file")
        // }
        await uploadToS3PresignedUrl(uploadedFile, signedUrl, key)
        toast({
          title: "Upload Successful",
          description: "Your video has been uploaded successfully.",
          variant: "default"
        })
        onFileChange(null)
        navigate("/dashboard")
      } catch (error) {
        console.error('error', error)
        toast({
          title: "Upload Failed",
          description: "Failed to upload video.",
          variant: "destructive"
        })
      }
      finally {
        setOpen(false)
        setIsSubmitting(false)
        setProgress(0)
      }
    }
  
   

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
    
    if (file && !title) {
      setTitle(file.name.split(".").slice(0, -1).join("."));
    }
  }

  return (
    <form onSubmit={uploadHandler} className="space-y-8">
      <ProgressDialogBox open={open} setOpen={setOpen} progress={progress} abortUpload={abortUpload} />
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <input
                  id="video-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {uploadedFile ? (
                  <div className="space-y-4 w-full text-center">
                    <div className="p-2 bg-muted rounded-md inline-flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-muted-foreground"
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
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleFileSelect}
                      >
                        Change File
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onFileChange(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 w-full text-center">
                    <div className="p-4 bg-muted rounded-full inline-flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-base font-medium">
                        Drag and drop your video here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse your files
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleFileSelect}
                    >
                      Select Video File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            { user?.roleInOrg === "OWNER" && <div className="flex items-center gap-3">
                <Label htmlFor="isPublic">Make it public</Label>
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>}
              
              {/* <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for your video"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div> */}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible defaultValue="formats">
              <AccordionItem value="resolutions">
                <AccordionTrigger>Resolutions</AccordionTrigger>
                <AccordionContent>
                  <ResolutionSelection 
                    selectedResolutions={selectedResolutions} 
                    setSelectedResolutions={setSelectedResolutions} 
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Uploading..." : "Upload & Start Transcoding"}
        </Button>
      </div>
    </form>
  );
};

export default UploadForm;

