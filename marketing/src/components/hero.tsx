import React from 'react'
import HeroImage from './hero-image'
import { GlowingEffect } from './ui/glowing-effect'
import Link from 'next/link'
import HeroDemo from './hero-demo'
import { NEXT_PUBLIC_MAIN_APP_URL } from '@/config'

function Hero() {
  return (
    <div className='flex flex-col max-w-sm md:max-w-2xl lg:max-w-5xl mx-auto justify-between gap-5 items-center light:bg-muted dark:bg-background py-5 '>
    <div className=''>
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
          href={`${NEXT_PUBLIC_MAIN_APP_URL}/login`}
          className="block p-4 h-full bg-gradient-to-b from-foreground via-foreground to-muted-foreground rounded-md text-background shadow-sky-500 shadow-md/30 hover:shadow-lg hover:shadow-sky-500/40 hover:translate-y-[-2px] transition-all duration-200 ease-in-out active:translate-y-px text-center"
        >
          Get Started
        </Link>
      </div>
      <HeroDemo />


    </div>
  </div>

  )
}

export default Hero
