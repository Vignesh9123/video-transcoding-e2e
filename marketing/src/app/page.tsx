import React from 'react'
import CTA  from '@/components/ui/call-to-action'
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
      
    </>
  )
}

export default Home
