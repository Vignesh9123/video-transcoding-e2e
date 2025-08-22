
import React from "react";
import { Link } from "react-router-dom";
import { ChevronUp, Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/ThemeProvider";

const Footer = () => {
  const { theme } = useTheme();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <footer className="bg-muted/80 border-t relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-center -mb-4">
          <Button 
            onClick={scrollToTop} 
            size="icon" 
            variant="secondary"
            className="rounded-full shadow-lg hover:translate-y-[-5px] transition-transform duration-300 animate-bounce"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
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
            </div>
            <p className="text-sm text-muted-foreground">
            Transform your videos with our powerful transcoding platform. Compress and optimize with ease.            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Features", "Pricing", "About Us"].map((item, index) => (
                <li key={index} className="hover:-translate-y-1 transition-transform duration-200">
                  <Link 
                    to="/" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((item, index) => (
                <li key={index} className="hover:-translate-y-1 transition-transform duration-200">
                  <Link 
                    to="/" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Connect</h3>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Mail, label: "Mail" },
              ].map(({ Icon, label }, index) => (
                <Button 
                  key={index} 
                  size="icon" 
                  variant="ghost"
                  className="hover:bg-accent hover:text-primary hover:scale-110 transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Button>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Subscribe to our newsletter:</p>
              <form className="flex mt-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-background border rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button className="rounded-l-none">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StreamForge. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Made with 💙 by <Link to="https://dub.sh/vignesh-portfolio" target="_blank">Vignesh</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
