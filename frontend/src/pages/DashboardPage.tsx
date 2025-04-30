
import Navbar from "@/components/layout/Navbar";
import VideoList from "@/components/dashboard/VideoList";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <VideoList />
      </div>
    </div>
  );
};

export default DashboardPage;
