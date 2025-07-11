import React from 'react'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useScroll, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import HLSPlayer from './HLSPlayer'
import { ThemeToggle } from './ui/theme-toggle'
export function HeroSection() {
    const { isAuthenticated } = useAuth();
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="py-24 md:pb-32 lg:pb-36 lg:pt-60 2xl:pt-96 2xl:pb-96 2xl:my-">
                        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
                            <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl md:font-bold xl:font-extrabold">Why Wait?<br /> Transcode While You Create.</h1>
                                <p className="mt-8 max-w-2xl text-balance text-lg">Transform your videos with our powerful transcoding platform. Compress and optimize with ease.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-12 rounded-full pl-5 pr-3 text-base">
                                        <Link to={isAuthenticated ? '/dashboard' : '/login'}>
                                            <span className="text-nowrap">Get Started</span>
                                            <ChevronRight className="ml-1" />
                                        </Link>
                                    </Button>
                                    <Button
                                        key={2}
                                        asChild 
                                        size="lg"
                                        variant="ghost"
                                        className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5">
                                        <Link to="#link">
                                            <span className="text-nowrap">Watch Demo</span>
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                        <div className="aspect-[2/3] absolute inset-1 overflow-hidden rounded-3xl border border-black/10  sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
                           <HLSPlayer src="/hero.mp4" />
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-2">
    <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm text-muted-foreground">
                    What makes our engine powerful
                </p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider gap={112}>
                    {[
                        { icon: "⚙️", label: "Automated FFmpeg Engine" },
                        { icon: "🎞️", label: "Multi-Resolution Output" },
                        { icon: "📦", label: "AWS S3 Storage" },
                        { icon: "📡", label: "HLS Streaming Format" },
                        { icon: "🔐", label: "Secure Uploads" },
                        { icon: "📉", label: "Bandwidth Efficient" },
                        { icon: "📬", label: "Real-Time Email Alerts" },
                        { icon: "🌱", label: "Eco-Friendly Design" },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center space-y-1 px-3">
                            <div className="text-3xl">{item.icon}</div>
                            <div className="text-sm text-muted-foreground">{item.label}</div>
                        </div>
                    ))}
                </InfiniteSlider>

                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                <ProgressiveBlur
                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                    direction="left"
                    blurIntensity={1}
                />
                <ProgressiveBlur
                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                    direction="right"
                    blurIntensity={1}
                />
            </div>
        </div>
    </div>
</section>

            </main>
        </>
    )
}

const menuItems = [
    // { name: 'Features', href: '#link' },
    // { name: 'Solution', href: '#link' },
    // { name: 'Pricing', href: '#link' },
    // { name: 'About', href: '#link' },
]

const HeroHeader = () => {
    const { isAuthenticated } = useAuth();
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group fixed z-20 w-full pt-2">
                <div className={cn('mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12', scrolled && 'bg-background/50 backdrop-blur-2xl')}>
                    <motion.div
                        key={1}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={cn('relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6', scrolled && 'lg:py-4')}>
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <div
                                className="flex items-center space-x-2">
                                <Logo />
                            </div>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="text-muted dark:text-muted-foreground dark:hover:text-primary hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <ThemeToggle />
                            {isAuthenticated ? ( 
                                <div>
                                <Button
                                    size="sm">
                                    <Link to="/dashboard">
                                        <span>Dashboard</span>
                                    </Link>
                                </Button>
                               </div>
                            ):(
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm">
                                    <Link to="/login">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                               
                            </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    const { isAuthenticated } = useAuth();

    return (

        <div className="flex items-center">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <span className="font-bold text-xl">StreamForge</span>
          </Link>
        </div>
    )
}
