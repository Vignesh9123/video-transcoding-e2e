'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { X } from 'lucide-react'

export default function HeroDemo() {
  const [open, setOpen] = useState(false)

  return (
    <>
       <AnimatePresence>
          {open && (
            <motion.div
              layoutId="hero-demo"
              className='absolute z-[10000] inset-0 flex items-center justify-center'
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1 , backdropFilter: "blur(5px)" }}
              exit={{ opacity: 0 , backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className='absolute inset-0 -z-10 bg-muted/50'></div>
              <div className='absolute top-10 right-10' onClick={() => setOpen(false)}>

              <X className=' text-black dark:text-white cursor-pointer' />
              </div>
              <video
                muted
                loop
                playsInline
                src="https://res.cloudinary.com/dxygc9jz4/video/upload/f_auto:video,q_auto/v1753439208/StreamForge_Demo_biljha"
                className='max-h-[90%] aspect-video object-contain rounded-lg shadow-lg'
                controls
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
              <motion.div
                layoutId="hero-demo"
                className={`relative h-full rounded-2xl border dark:hover:border-neutral-700 hover:border-neutral-400 p-2 md:rounded-xl md:p-2 cursor-pointer ${open ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
                onClick={() =>{
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                   setOpen(true)}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                <GlowingEffect
                  spread={30}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  variant='white'
                />
                <div className="block p-4 bg-gradient-to-b from-background via-background to-muted rounded-md text-foreground shadow-sky-500 shadow-md/30 hover:shadow-lg hover:shadow-sky-500/40 hover:translate-y-[-2px] transition-all duration-200 ease-in-out active:translate-y-px text-center">
                  Watch Demo
                </div>
              </motion.div>
            
          </AnimatePresence>
    </>
  )
}
