import { GlowingEffect } from '@/components/ui/glowing-effect'
import Link from 'next/link'
import React from 'react'
import HeroDemo from '@/components/hero-demo'
import HeroImage from '@/components/hero-image'
import { Cover } from '@/components/ui/cover'
import { Particles } from '@/components/ui/particles'
import { CTA } from '@/components/ui/call-to-action'
import { Footer } from '@/components/ui/footer'
import Pricing from '@/components/pricing'
import Features from '@/components/features'
import Hero from '@/components/hero'


function Home() {

  return (
    <>
      <Hero/>
      <Features/>

      <Pricing/>   
      <CTA/>
      <Footer />
    </>
  )
}

export default Home
