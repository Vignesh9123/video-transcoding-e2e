import { MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NEXT_PUBLIC_MAIN_APP_URL } from "@/config";
import Link from "next/link";

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
            Video processing shouldn&apos;t be complicated. Skip the complex setup and expensive infrastructure. Our cloud-native platform transforms your videos into streaming-ready content in minutes, not hours. From upload to adaptive playback - we handle the entire pipeline so you can focus on your content.
            </p>
          </div>
          <div className="flex flex-row gap-4 relative ">
            <Link href={`${NEXT_PUBLIC_MAIN_APP_URL}/login`} className="gap-4 shadow-[0px_2px_0px_0px] shadow-sky-500/30 hover:shadow-lg hover:shadow-sky-500/40 hover:translate-y-[-2px] transition-all duration-200 ease-in-out active:translate-y-px flex items-center bg-gradient-to-b from-foreground via-foreground to-muted-foreground rounded-md px-4 py-2 text-background">
              Sign up here <MoveRight className="w-4 h-4" />
            </Link>
            <div className="absolute bottom-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500 to-transparent w-[95%] mx-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA 
