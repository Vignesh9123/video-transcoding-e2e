import React from 'react'
import { Cover } from './ui/cover'
import { GlowingEffect } from './ui/glowing-effect'
import Link from 'next/link'

function Pricing() {
  return (
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
                <span className='text-base md:text-lg font-semibold align-top ml-1'>/min/resolution</span>
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
  )
}

export default Pricing
