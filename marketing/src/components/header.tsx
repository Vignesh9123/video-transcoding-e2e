"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { NEXT_PUBLIC_MAIN_APP_URL } from "@/config";
export function Header() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const dashboardNavItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Upload",
      link: "/upload",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {data, isPending = true} = authClient.useSession()
  const pathname = usePathname();

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          {pathname === "/" && <NavItems items={navItems} />}
          {(pathname === "/dashboard" || pathname === "/upload") && data?.session && <NavItems items={dashboardNavItems} />}
          {!isPending && !data?.session && <div className="flex items-center gap-4">
            <NavbarButton  href={`${NEXT_PUBLIC_MAIN_APP_URL}/login`} as={Link}>Login</NavbarButton>
          </div>}
          {!isPending && data?.session && <div className="flex items-center gap-4">
            <NavbarButton href={`${NEXT_PUBLIC_MAIN_APP_URL}/dashboard`} as={Link}>Dashboard</NavbarButton>
          </div>
          }
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {pathname === "/" ? (
              <>
                {navItems.map((item, idx) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-neutral-600 dark:text-neutral-300"
                  >
                    <span className="block">{item.name}</span>
                  </Link>
                ))}
                <div className="flex w-full flex-col gap-4">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    Book a call
                  </NavbarButton>
                </div>
              </>
            ) : (
              <>
                {dashboardNavItems.map((item, idx) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-neutral-600 dark:text-neutral-300"
                  >
                    <span className="block">{item.name}</span>
                  </Link>
                ))}
                <div className="flex w-full flex-col gap-4">
                  <NavbarButton
                    onClick={async () => {
                      await authClient.signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="primary"
                    className="w-full"
                  >
                    Logout
                  </NavbarButton>
                </div>
              </>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      
    </div>
  );
}
