"use client";
import React from 'react'
import { motion } from 'motion/react'
import { Button } from "./ui/button";
import { Github } from 'lucide-react'
import { authClient } from '@/lib/auth-client';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.92h5.45c-.24 1.28-1.47 3.76-5.45 3.76-3.28 0-5.96-2.7-5.96-6.04S8.72 5.8 12 5.8c1.87 0 3.12.8 3.84 1.48l2.62-2.54C17.05 3.45 14.74 2.5 12 2.5 6.99 2.5 2.94 6.55 2.94 11.64S6.99 20.8 12 20.8c6.92 0 8.06-5.84 7.57-8.49H12z" />
    </svg>
  )
}


function SignInOptions() {
  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'http://localhost:3000/dashboard'

    })
  }

  const handleGithub = async() => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: 'http://localhost:3000/dashboard'
  
      })
  }
  return (
    <>
      <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
        <Button onClick={handleGoogle} variant="outline" size="lg" className="w-full justify-center">
          <GoogleIcon className="size-5" />
          Continue with Google
        </Button>
      </motion.div>
      <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
        <Button onClick={handleGithub} variant="outline" size="lg" className="w-full justify-center">
          <Github className="size-5" />
          Continue with GitHub
        </Button>
      </motion.div>
    </>
  )
}

export default SignInOptions
