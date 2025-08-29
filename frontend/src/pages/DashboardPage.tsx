
import Navbar from "@/components/layout/Navbar";
import VideoList from "@/components/dashboard/VideoList";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container max-w-7xl py-8 flex-grow">
        <VideoList />
      </div>
    </div>
  );
};

export default DashboardPage;
