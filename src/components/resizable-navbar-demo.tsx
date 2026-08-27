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
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Demo from "@/components/demo";
import Text3DFlip from "@/components/ui/text-3d-flip";
import ConnectedHero from "@/components/ui/ConnectedHero";
import { Poppins } from "next/font/google";


const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

export default function NavbarDemo() {
  const navItems = [
    { name: "Features", link: "features" },
    { name: "Pricing", link: "pricing" },
    { name: "Contact", link: "contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(Boolean(session));
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  const authLinks = isAuthenticated ? (
    <NavbarButton href={`${siteConfig.url}/home`} variant="primary">
      Dashboard
    </NavbarButton>
  ) : (
    <>
      <NavbarButton href={`${siteConfig.url}/auth/login`} variant="secondary">
        Login
      </NavbarButton>
      <NavbarButton href={`${siteConfig.url}/auth/signup`} variant="primary">
        SignUp
      </NavbarButton>
    </>
  );

  return (
    <div className="relative w-full">
      <Navbar className={poppins.className}>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">{authLinks}</div>
        </NavBody>

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
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {isAuthenticated ? (
                <NavbarButton
                  href={`${siteConfig.url}/home`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Dashboard
                </NavbarButton>
              ) : (
                <>
                  <NavbarButton
                    href={`${siteConfig.url}/auth/login`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Login
                  </NavbarButton>
                  <NavbarButton
                    href={`${siteConfig.url}/auth/signup`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="primary"
                    className="w-full"
                  >
                    SignUp
                  </NavbarButton>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <DummyContent />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      <main>
        <section className="relative isolate mx-auto min-h-312.5 w-full max-w-7xl overflow-hidden px-4 py-16 mt-[12vh] sm:min-h-[1150px] sm:px-8 md:min-h-[1120px]">
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="md:text-8xl text-[2.50rem] lg:w-[65%] w-full font-extrabold leading-none text-center">
            Education Beyond The Textbook
          </h1>
          <h3 className="md:text-3xl text-2xl md:w-1/2 text-center md:mt-10 mt-5">
            <Text3DFlip
              className="bg-background"
              textClassName="bg-background text-foreground"
              flipTextClassName="bg-background text-foreground"
              rotateDirection="top"
            >
              Helping children discover, practice, and apply skills that matter
              beyond academic achievement.
            </Text3DFlip>
          </h3>
          </div>
          <ConnectedHero />
        </section>
        <section className="min-h-dvh mt-[-35vh]">
          <Demo />
        </section>
      </main>
    </>
  );
};
