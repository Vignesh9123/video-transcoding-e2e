
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { axiosClient } from "@/config/axiosConfig";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [organizationDetails, setOrganizationDetails] = useState<{
    name: string;
    userCount: number;
  }>(null);
  async function fetchOrganization() {
      setLoading(true);
      const response = await axiosClient.get(`/api/org/data/${user.organization}`)
      setOrganizationDetails({
        name: response.data.name,
        userCount: response.data.userCount
      });
      setLoading(false);
  }
  useEffect(() => {
    if(user){
      fetchOrganization();
    }
  }, [user])

  const handleNotificationChange = () => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 pl-5">Your Profile</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                    <p className="text-base">{user?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                    <p className="text-base">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Configure when you receive email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-base font-medium">Transcoding Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when video transcoding is complete
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleNotificationChange}
                  >
                    Enabled
                  </Button>
                </div>
                <div className="flex items-center justify-between py-2 border-t">
                  <div>
                    <h3 className="text-base font-medium">Processing Failed</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when video transcoding fails
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleNotificationChange}
                  >
                    Enabled
                  </Button>
                </div>
              </CardContent>
            </Card>
            {
              loading && <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>View your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                    <p className="text-base">Loading...</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">User Count</h3>
                    <p className="text-base">Loading...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            }
           {organizationDetails && <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>View your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                    <p className="text-base">{organizationDetails?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">User Count</h3>
                    <p className="text-base">{organizationDetails?.userCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>}
            <Card className="md:flex md:items-center md:justify-between">
            <CardHeader >
              <CardTitle>Theme</CardTitle>
              <CardDescription>Toggle between light and dark mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <ThemeToggle />
            </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
