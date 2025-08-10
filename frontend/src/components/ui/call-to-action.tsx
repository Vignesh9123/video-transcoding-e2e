import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <div className="w-full py-20">
      <div className="mx-auto">
        <div className="flex flex-col text-center bg-muted/30 rounded-md p-4 lg:p-14 gap-8 items-center">
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
          <div className="flex flex-row gap-4 relative ">
            <Button className="gap-4 shadow-[0px_2px_0px_0px] shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-500/40 hover:translate-y-[-2px] transition-all duration-200 ease-in-out active:translate-y-px">
              Sign up here <MoveRight className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent w-[95%] mx-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { CTA };
