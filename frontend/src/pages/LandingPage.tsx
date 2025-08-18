
import { HeroSection } from "@/components/hero-section-5";
const LandingPage = () => {
  return (
    <div>
    <HeroSection/>
    <FeatureStepsDemo/>
    </div>
  );
};

export default LandingPage;

import { FeatureSteps } from "@/components/feature-section"

const features = [
  {
    step: 'Step 1',
    title: 'Upload Instantly',
    content: 'Drag and drop your raw video — we take it from here. Secure, fast, and cloud-native.',
    darkImage: '/features/1.png',
    lightImage: '/features/1-light.png'
  },
  {
    step: 'Step 2',
    title: 'Auto-Transcode in the Cloud',
    content: 'Your video is compressed, converted into multiple resolutions, and HLS-ready — all on autopilot.',
    darkImage: '/features/2.png',
    lightImage: '/features/2-light.png'
  },
  {
    step: 'Step 3',
    title: 'Stream Anywhere',
    content: 'Adaptive streaming with broad compatibility. Seamless playback across any device, any network.',
    darkImage: '/features/3.png',
    lightImage: '/features/3-light.png'
  },
]


export function FeatureStepsDemo() {
  return (
    <div className=" mx-auto px-4 py-8 flex-grow bg-gray-200 dark:bg-gray-950 rounded-xl">

      <FeatureSteps 
        features={features}
        title="From Upload to Playback"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
        />
        </div>
  )
}