import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Search, User, LogIn, LogOut } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter
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
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();
  
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
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
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
            
            {/* Cart Button with Slide-out Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-farm-accent-red text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[350px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[60vh]">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Your cart is empty</h3>
                    <p className="text-muted-foreground mt-2 text-center">
                      Add items to your cart to see them here.
                    </p>
                    <SheetClose asChild>
                      <Button className="mt-6 bg-farm-green hover:bg-farm-green-dark">
                        Continue Shopping
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mt-4 flex-1 overflow-y-auto max-h-[65vh]">
                      {cartItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="w-20 h-20">
                                <img 
                                  src={item.product.image_url || 'https://placehold.co/80x80?text=Product'} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-farm-green font-medium">
                                    ${item.product.price.toFixed(2)} / {item.product.unit}
                                  </p>
                                  <div className="flex items-center border rounded-md">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                      -
                                    </Button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <p className="font-medium">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                  </p>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 hover:text-red-500 p-0"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <SheetFooter className="mt-6">
                        <Button className="w-full bg-farm-green hover:bg-farm-green-dark">
                          Checkout
                        </Button>
                      </SheetFooter>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
