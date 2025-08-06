'use client'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react' 
import { X } from 'lucide-react'
import HeroMotion from '@/components/hero-motion'

function Home() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className='max-w-5xl mx-auto min-h-screen flex flex-col justify-between items-center light:bg-muted dark:bg-background py-10 '>
        <div className='mt-20'>
          <h1 className='text-3xl text-center md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent'>
            Transcode. Stream. Scale.
          </h1>
          <p className='text-muted-foreground mt-3 text-center font-medium'>
            Instant video processing with adaptive streaming. Built for creators, educators, and developers.
          </p>
        </div>

        <div className='border border-muted rounded-lg shadow-lg dark:shadow-muted'>
          <Image
            src="/hero-light.png"
            priority
            alt="hero"
            width={1000}
            height={500}
            className='p-2 rounded-xl dark:hidden'
          />
          <Image
            src="/hero.png"
            priority
            alt="hero"
            width={1000}
            height={500}
            className='p-2 rounded-xl hidden dark:block'
          />
        </div>

        <div className='flex items-center justify-center gap-2'>
          <div className="relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl md:p-2">
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
              Get Started for Free
            </Link>
          </div>
          <HeroMotion/>

          
        </div>
      </div>
    </>
  )
}

export default Home
