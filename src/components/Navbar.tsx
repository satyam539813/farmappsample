
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, User, LogIn, LogOut } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { categoryList } from '@/data/categories';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  
  // Listen for scroll events to change navbar styles
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] scrollbar-hide">
              <div className="py-4">
                <div className="text-2xl font-bold text-farm-green mb-6">FarmFresh</div>
                <nav className="flex flex-col space-y-4">
                  <Link to="/" className="text-lg py-2 border-b border-muted">Home</Link>
                  <Link to="/shop" className="text-lg py-2 border-b border-muted">Shop</Link>
                  <Link to="/about" className="text-lg py-2 border-b border-muted">About Us</Link>
                  <Link to="/contact" className="text-lg py-2 border-b border-muted">Contact</Link>
                  {user ? (
                    <button 
                      onClick={() => signOut()} 
                      className="text-lg py-2 border-b border-muted flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  ) : (
                    <Link to="/auth" className="text-lg py-2 border-b border-muted flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <div className="flex-1 lg:flex-initial">
            <Link to="/" className="text-2xl font-bold text-farm-green-dark dark:text-farm-green">
              FarmFresh
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link">Categories</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categoryList.slice(0, 6).map((category) => (
                  <DropdownMenuItem key={category.id}>
                    <Link to={`/shop?category=${category.name.toLowerCase()}`} className="w-full">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Link to="/shop" className="w-full font-medium text-farm-green">
                    View All Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-farm-accent-red text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                0
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
