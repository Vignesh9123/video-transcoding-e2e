
import  { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import UploadForm from "@/components/upload/UploadForm";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className=" px-4 py-8 flex-grow">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Upload a New Video</h1>
            <Button className="flex items-center"  asChild>
          <Link to="/dashboard"><div className="">Dashboard</div></Link>
        </Button>          </div>
          <UploadForm onFileChange={setUploadedFile} uploadedFile={uploadedFile} />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
