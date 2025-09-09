
import Navbar from "@/components/layout/Navbar";
import VideoList from "@/components/dashboard/VideoList";
import { Input } from "@/components/ui/input";
import { Command } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const searchRef = useRef<HTMLInputElement>(null);
  const {user} = useAuth()

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-7xl py-8 flex-grow">
        <div className="flex flex-col gap-3 my-3">
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
      </div>
        <VideoList debouncedSearchQuery={debouncedSearchQuery}/>
      </div>
    </div>
  );
};

export default DashboardPage;
