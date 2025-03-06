
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";

export default function NavBar() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b border-border/40 sticky top-0 z-50 w-full backdrop-blur-md bg-background/80">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-semibold text-brand">सखी</span>
          <span className="text-xl font-semibold">Junction</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/home" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/community" className={`nav-link ${isActive('/community') ? 'active' : ''}`}>Community</Link>
          <Link to="/health-tracker" className={`nav-link ${isActive('/health-tracker') ? 'active' : ''}`}>Health Tracker</Link>
          <Link to="/articles" className={`nav-link ${isActive('/articles') ? 'active' : ''}`}>Articles</Link>
          <Link to="/self-care" className={`nav-link ${isActive('/self-care') ? 'active' : ''}`}>Self-Care</Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </Button>
          
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-brand hover:bg-brand-600 text-white font-medium">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
