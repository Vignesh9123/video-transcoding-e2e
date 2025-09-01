'use client'
import React, { useRef } from 'react'
import {motion, useScroll, useTransform} from 'motion/react'
function HeroImage() {
    const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0.3, 0.6], [10, 0]);
  const translateZ = useTransform(scrollYProgress, [0.3, 0.6], [50, 0]);
  const translateY = useTransform(scrollYProgress, [0.3, 0.6], [-30, 0]);
  return (
    <motion.div ref={ref} className='bg-background border border-muted rounded-lg shadow-lg dark:shadow-muted perspective-midrange transform-3d'
         
        >
          <motion.img
            src="/hero-light.png"
            alt="hero"
            width={1000}
            height={500}
            className='rounded-xl dark:hidden border m-2'
            style={{
              rotateX,
              translateZ,
              translateY,
            }}
            
          />
          <motion.img
            src="/hero.png"
            alt="hero"
            width={1000}
            height={500}
            className='rounded-xl hidden dark:block border m-2'
            style={{
              rotateX,
              translateZ,
              translateY,
            }}
            
          />
        </motion.div>
  )
}

export default HeroImage
