import React from 'react'
import { Particles } from './ui/particles'

function Features() {
  return (
    <section id="features" className='w-full bg-muted/30 mx-auto'>
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
  )
}

export default Features
