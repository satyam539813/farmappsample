
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
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
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="py-4">
                <div className="text-2xl font-bold text-farm-green mb-6">FarmFresh</div>
                <nav className="flex flex-col space-y-4">
                  <Link to="/" className="text-lg py-2 border-b border-muted">Home</Link>
                  <Link to="/shop" className="text-lg py-2 border-b border-muted">Shop</Link>
                  <a href="#categories" className="text-lg py-2 border-b border-muted">Categories</a>
                  <a href="#about" className="text-lg py-2 border-b border-muted">About Us</a>
                  <a href="#contact" className="text-lg py-2 border-b border-muted">Contact</a>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <div className="flex-1 lg:flex-initial">
            <Link to="/" className="text-2xl font-bold text-farm-green-dark">
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
            
            <a href="#about" className="nav-link">About Us</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
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
