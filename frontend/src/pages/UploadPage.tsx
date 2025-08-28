
import  { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import UploadForm from "@/components/upload/UploadForm";
import { Link } from "react-router-dom";

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Upload a New Video</h1>
            <Link to="/dashboard" className="p-2 bg-foreground text-background rounded text-lg">Dashboard</Link>
          </div>
          <UploadForm onFileChange={setUploadedFile} uploadedFile={uploadedFile} />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
