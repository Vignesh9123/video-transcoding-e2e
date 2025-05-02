
import { HeroSection } from "@/components/hero-section-5";
const LandingPage = () => {
  return (
    // <div className="flex flex-col min-h-screen">
    //   <header className="bg-gradient-to-b from-background to-muted py-16 lg:py-24">
    //     <div className="container mx-auto px-4 flex flex-col items-center text-center">
    //       <div className="inline-block mb-8">
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           viewBox="0 0 24 24"
    //           fill="none"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           className="h-16 w-16 text-primary"
    //         >
    //           <polygon points="23 7 16 12 23 17 23 7" />
    //           <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    //         </svg>
    //       </div>
    //       <h1 className="text-4xl md:text-6xl font-bold mb-6">TranscodeCanvas</h1>
    //       <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl">
    //         Transform your videos with our powerful transcoding platform. Convert, resize, and optimize with ease.
    //       </p>
    //       <div className="flex flex-col sm:flex-row gap-4 justify-center">
    //         <Button size="lg" asChild>
    //           <Link to="/signup">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
    //         </Button>
    //         <Button size="lg" variant="outline" asChild>
    //           <Link to="/login">Sign In</Link>
    //         </Button>
    //       </div>
    //     </div>
    //   </header>

    //   <section className="py-16 lg:py-24">
    //     <div className="container mx-auto px-4">
    //       <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Powerful Video Transcoding Features</h2>
          
    //       <div className="grid md:grid-cols-3 gap-8">
    //         <div className="bg-card p-6 rounded-lg shadow-sm border">
    //           <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               className="h-6 w-6 text-primary"
    //             >
    //               <rect x="2" y="6" width="20" height="12" rx="2" />
    //               <line x1="12" y1="2" x2="12" y2="10" />
    //               <line x1="16" y1="2" x2="16" y2="6" />
    //               <line x1="8" y1="2" x2="8" y2="6" />
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
    //           <p className="text-muted-foreground">
    //             Convert your videos to different formats including MP4 and HLS (M3U8) for streaming.
    //           </p>
    //         </div>
            
    //         <div className="bg-card p-6 rounded-lg shadow-sm border">
    //           <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               className="h-6 w-6 text-primary"
    //             >
    //               <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-2">Resolution Options</h3>
    //           <p className="text-muted-foreground">
    //             Choose from multiple resolution outputs from 360p all the way up to 1080p HD quality.
    //           </p>
    //         </div>
            
    //         <div className="bg-card p-6 rounded-lg shadow-sm border">
    //           <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 24 24"
    //               fill="none"
    //               stroke="currentColor"
    //               strokeWidth="2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               className="h-6 w-6 text-primary"
    //             >
    //               <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    //               <circle cx="8.5" cy="8.5" r="1.5" />
    //               <polyline points="21 15 16 10 5 21" />
    //             </svg>
    //           </div>
    //           <h3 className="text-xl font-semibold mb-2">Batch Processing</h3>
    //           <p className="text-muted-foreground">
    //             Upload and transcode multiple videos at once to save time and streamline your workflow.
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   <section className="py-16 lg:py-24 bg-muted">
    //     <div className="container mx-auto px-4">
    //       <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          
    //       <div className="grid md:grid-cols-4 gap-8">
    //         <div className="text-center">
    //           <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary-foreground">1</div>
    //           <h3 className="text-xl font-semibold mb-2">Upload</h3>
    //           <p className="text-muted-foreground">
    //             Upload your video files to our secure platform
    //           </p>
    //         </div>
            
    //         <div className="text-center">
    //           <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary-foreground">2</div>
    //           <h3 className="text-xl font-semibold mb-2">Configure</h3>
    //           <p className="text-muted-foreground">
    //             Select your desired output formats and resolutions
    //           </p>
    //         </div>
            
    //         <div className="text-center">
    //           <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary-foreground">3</div>
    //           <h3 className="text-xl font-semibold mb-2">Process</h3>
    //           <p className="text-muted-foreground">
    //             Our system transcodes your video in the cloud
    //           </p>
    //         </div>
            
    //         <div className="text-center">
    //           <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold text-primary-foreground">4</div>
    //           <h3 className="text-xl font-semibold mb-2">Download</h3>
    //           <p className="text-muted-foreground">
    //             Get notified and download your transcoded videos
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </section>

    //   <section className="py-16 lg:py-24">
    //     <div className="container mx-auto px-4 text-center">
    //       <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Videos?</h2>
    //       <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
    //         Join thousands of content creators who trust TranscodeCanvas for their video processing needs.
    //       </p>
    //       <Button size="lg" asChild>
    //         <Link to="/signup">Create Free Account</Link>
    //       </Button>
    //     </div>
    //   </section>

    //   <footer className="mt-auto py-10 bg-muted/50 border-t">
    //     <div className="container mx-auto px-4">
    //       <div className="flex flex-col md:flex-row justify-between items-center">
    //         <div className="mb-6 md:mb-0 flex items-center">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             viewBox="0 0 24 24"
    //             fill="none"
    //             stroke="currentColor"
    //             strokeWidth="2"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             className="h-6 w-6 text-primary mr-2"
    //           >
    //             <polygon points="23 7 16 12 23 17 23 7" />
    //             <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    //           </svg>
    //           <span className="font-bold text-xl">TranscodeCanvas</span>
    //         </div>
    //         <div className="text-sm text-muted-foreground">
    //           © 2025 TranscodeCanvas. All rights reserved.
    //         </div>
    //       </div>
    //     </div>
    //   </footer>
    // </div>
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