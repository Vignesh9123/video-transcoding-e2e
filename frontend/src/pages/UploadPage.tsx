
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import UploadForm from "@/components/upload/UploadForm";

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Upload a New Video</h1>
          <UploadForm onFileChange={setUploadedFile} uploadedFile={uploadedFile} />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
