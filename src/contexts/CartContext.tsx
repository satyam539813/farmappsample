
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export type CartItem = {
  id: string;
  product_id: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string;
    unit: string;
  };
};

type CartContextType = {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            price,
            image_url,
            unit
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems(data.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.products
      })));
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Failed to load cart",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to your cart",
      });
      return;
    }

    try {
      // Check if product already in cart
      const existingItemIndex = cartItems.findIndex(item => item.product_id === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const itemId = cartItems[existingItemIndex].id;
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity, updated_at: new Date() })
          .eq('id', itemId);

        if (error) throw error;

        // Update local state
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity = newQuantity;
        setCartItems(updatedItems);
      } else {
        // Add new item to cart
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
          .select(`
            id,
            product_id,
            quantity,
            products (
              name,
              price,
              image_url,
              unit
            )
          `)
          .single();

        if (error) throw error;

        // Update local state
        setCartItems([...cartItems, {
          id: data.id,
          product_id: data.product_id,
          quantity: data.quantity,
          product: data.products
        }]);
      }

      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully",
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Failed to add item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return;
    
    try {
      if (quantity <= 0) {
        return removeFromCart(itemId);
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date() })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      
      setCartItems(updatedItems);
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast({
        title: "Failed to update cart",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setCartItems(cartItems.filter(item => item.id !== itemId));
      
      toast({
        title: "Item removed",
        description: "Item removed from your cart",
      });
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Calculate cart totals
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.price * item.quantity), 
    0
  );

  return (
    <CartContext.Provider value={{ 
      cartItems,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
