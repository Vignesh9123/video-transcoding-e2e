
// import React from 'react'
// import { GlowingEffect } from '@/components/ui/glowing-effect'
// import { Particles } from '@/components/ui/particles'
// import { authClient } from '@/lib/auth-client'
// import SignInOptions from '@/components/SignInOptions'
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'

// async function LoginPage() {
//   const cookieStore = await cookies()

//   await authClient.getSession({
//     fetchOptions:{
//       headers: {
//         cookie: cookieStore.toString() ,
//       },
//       onSuccess: (res) => {
//         if(res.data?.session) {
//           return redirect('/dashboard')
//         }
//       }
//     }
//   })
  
//   return (
//     <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
//       <Particles className="absolute inset-0 z-0 0" quantity={180} ease={80} color={"#888888"} refresh />
//       <div className="relative z-10 w-full max-w-lg">
//         <div className="relative rounded-2xl border p-4 md:p-8 bg-background/70 backdrop-blur">
//           <GlowingEffect
//             spread={30}
//             glow={true}
//             disabled={false}
//             proximity={64}
//             inactiveZone={0.01}
//             variant='white'
//           />
//           <div className="space-y-6">
//             <div className="text-center space-y-2 mt-2">
//               <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
//                 Welcome back
//               </h1>
//               <p className="text-muted-foreground text-sm md:text-base">Sign in to continue transcoding and streaming seamlessly.</p>
//             </div>

//             <div className="grid gap-3 mt-6">
//               <SignInOptions/>
//             </div>

//             <div className="text-center text-xs text-muted-foreground">
//               By continuing, you agree to our Terms and Privacy Policy.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default LoginPage


import { redirect } from "next/navigation";

export default function LoginPage() {
  redirect(`${process.env.NEXT_PUBLIC_MAIN_APP_URL}/login`);
}