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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, isPending = true } = authClient.useSession()

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          {!isPending && !data?.session && <div className="flex items-center gap-4">
            <NavbarButton href={`${NEXT_PUBLIC_MAIN_APP_URL}/login`} as={Link}>Login</NavbarButton>
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
          >
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
                as={Link}
                href={`${NEXT_PUBLIC_MAIN_APP_URL}/login`}
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
            </div>

          </MobileNavMenu>
        </MobileNav>
      </Navbar>

    </div>
  );
}
