import { GlowingEffect } from '@/components/ui/glowing-effect'
import Link from 'next/link'
import React from 'react'
import HeroDemo from '@/components/hero-demo'
import HeroImage from '@/components/hero-image'
import { Cover } from '@/components/ui/cover'
import { Particles } from '@/components/ui/particles'
import { CTA } from '@/components/ui/call-to-action'
import { Footer } from '@/components/ui/footer'


function Home() {

  return (
    <>
      <div className='mx-auto  flex flex-col justify-between gap-5 items-center light:bg-muted dark:bg-background py-10 '>
        <div className='mt-20'>
          <h1 className='text-3xl text-center md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent'>
            Transcode. Stream. Scale.
          </h1>
          <p className='text-muted-foreground mt-3 text-center font-medium'>
            Instant video processing with adaptive streaming. Built for creators, educators, and developers.
          </p>
        </div>
        <HeroImage />


        <div className='flex items-center justify-center gap-2'>
          <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
            <GlowingEffect
              spread={30}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              variant='white'
            />
            <Link
              href="/"
              className="block p-4 h-full bg-gradient-to-b from-foreground via-foreground to-muted-foreground rounded-md text-background shadow-sky-500 shadow-md/30 hover:shadow-lg hover:shadow-sky-500/40 hover:translate-y-[-2px] transition-all duration-200 ease-in-out active:translate-y-px text-center"
            >
              Get Started
            </Link>
          </div>
          <HeroDemo />


        </div>
      </div>

      <section id="features" className='w-full bg-muted/30 container mx-auto'>
        <div className='max-w-5xl mx-auto px-4 md:px-0 py-12 md:py-16 relative'>
        <Particles
          className="absolute inset-0 z-0 opacity-0 dark:opacity-50 "
          quantity={100}
          ease={80}
          color={"#ffffff"}
          refresh
        />
        <Particles
          className="absolute inset-0 z-0 opacity-50 dark:opacity-0 "
          quantity={100}
          ease={80}
          color={"#000000"}
          refresh
        />
          <div className='text-center mb-8 md:mb-12'>
            <h2 className='text-2xl md:text-4xl font-semibold tracking-tight'>Powerful Video Processing</h2>
            <p className='text-muted-foreground mt-2'>Upload once, choose your output resolutions, and start streaming fast.</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-6 flex flex-col h-full'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Direct Upload</h3>
                <p className='text-muted-foreground text-sm'>Direct, secure uploads via presigned URLs—no server bottlenecks.</p>
              </div>
            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-6 flex flex-col h-full'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Choose Your Resolutions</h3>
                <p className='text-muted-foreground text-sm'>Pick exactly the outputs you need—360p, 720p, 1080p, or custom—pay only for what you use.</p>
              </div>
            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-6 flex flex-col h-full'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Real-Time Progress</h3>
                <p className='text-muted-foreground text-sm'>Live progress and status updates as your videos process.</p>
              </div>
            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-6 flex flex-col h-full'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Built to Scale</h3>
                <p className='text-muted-foreground text-sm'>Parallel processing handles spikes and large queues without slowing down.</p>
              </div>
            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-6 flex flex-col h-full'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Adaptive Streaming</h3>
                <p className='text-muted-foreground text-sm'>HLS manifests and segmented video for smooth playback on any device.</p>
              </div>
            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-6 flex flex-col h-full'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold mb-2'>Secure by Default</h3>
                <p className='text-muted-foreground text-sm'>Presigned uploads and isolated processing keep your files private and safe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className='w-full'>
        <div className='max-w-5xl mx-auto px-4 md:px-0 py-12 md:py-16'>
          <div className='text-center mb-8 md:mb-12'>
            <h2 className='text-2xl md:text-4xl font-semibold tracking-tight'>Pricing</h2>
            <p className='text-muted-foreground mt-2'>Simple, transparent, usage-based pricing.</p>
          </div>

          <div className='rounded-2xl border dark:border-neutral-800 border-neutral-200 p-6 md:p-8 text-center'>
            <div className='text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2'>Usage pricing</div>
            <Cover>

              <div className=' text-4xl md:text-5xl font-bold'>
                $0.005
                <span className='text-base md:text-lg font-semibold align-top ml-1'>/min/res</span>
              </div>
            </Cover>
            <p className='text-muted-foreground mt-3 text-sm md:text-base'>
              Billed per transcoded minute per resolution. Example: 1080p + 720p counts as 2 resolutions.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12'>
            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <GlowingEffect
                spread={30}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                variant='white'
              />
              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-3 flex flex-col'>


                <h3 className='text-lg font-semibold'>Starter</h3>
                <p className='text-muted-foreground mt-1'>$5/mo</p>
                <div className='mt-4 text-sm space-y-1'>
                  <p><span className='font-medium'>$5 credits included</span></p>
                  <p className='text-muted-foreground'>≈ 1,000 mins @ 1 res</p>
                  <p className='text-muted-foreground'>Additional usage at $0.005/min/res</p>
                </div>
                <Link href='/' className='mt-6 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors'>
                  Choose Starter
                </Link>
              </div>

            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <GlowingEffect
                spread={30}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />

              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-3 flex flex-col relative'>
                <span className='absolute -top-3 right-4 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground'>Popular</span>
                <h3 className='text-lg font-semibold'>Pro</h3>
                <p className='text-muted-foreground mt-1'>$20/mo</p>
                <div className='mt-4 text-sm space-y-1'>
                  <p><span className='font-medium'>$20 credits included</span></p>
                  <p className='text-muted-foreground'>≈ 4,000 mins @ 1 res</p>
                  <p className='text-muted-foreground'>Additional usage at $0.005/min/res</p>
                </div>
                <Link href='/' className='mt-6 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors'>
                  Choose Pro
                </Link>
              </div>

            </div>

            <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl">
              <GlowingEffect
                spread={30}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                variant='white'
              />

              <div className='rounded-xl border dark:border-neutral-800 border-neutral-200 p-3 flex flex-col'>
                <h3 className='text-lg font-semibold'>Business</h3>
                <p className='text-muted-foreground mt-1'>$60/mo</p>
                <div className='mt-4 text-sm space-y-1'>
                  <p><span className='font-medium'>$60 credits included</span></p>
                  <p className='text-muted-foreground'>≈ 12,000 mins @ 1 res</p>
                  <p className='text-muted-foreground'>Priority support</p>
                  <p className='text-muted-foreground'>Additional usage at $0.005/min/res</p>
                </div>
                <Link href='/' className='mt-6 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors'>
                  Choose Business
                </Link>
              </div>
            </div>



          </div>
        </div>
      </section>
      
      <CTA/>
      <Footer />
    </>
  )
}

export default Home
