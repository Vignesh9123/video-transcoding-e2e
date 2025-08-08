import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col text-center bg-muted rounded-md p-4 lg:p-14 gap-8 items-center">
          <div>
            <Badge>Get started</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular">
            Start transcoding now
            </h3>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl">
            Video processing shouldn't be complicated. Skip the complex setup and expensive infrastructure. Our cloud-native platform transforms your videos into streaming-ready content in minutes, not hours. From upload to adaptive playback - we handle the entire pipeline so you can focus on your content.
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <Button className="gap-4">
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
