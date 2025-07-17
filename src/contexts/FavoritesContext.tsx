import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  unit: string;
};

type FavoriteItem = {
  id: string;
  product: Product;
};

type FavoritesContextType = {
  favoriteItems: FavoriteItem[];
  favoriteCount: number;
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const favoriteCount = favoriteItems.length;

  // Fetch favorites from Supabase when user changes
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        // If no user is logged in, try to load from localStorage
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
          try {
            setFavoriteItems(JSON.parse(savedFavorites));
          } catch (error) {
            console.error("Error parsing saved favorites:", error);
            localStorage.removeItem("favorites");
          }
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            product_id
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error fetching favorites:", error);
          return;
        }

        if (data) {
          // Transform database records into FavoriteItem objects
          const favoritePromises = data.map(async (item) => {
            const { data: productData } = await supabase
              .from('products')
              .select('*')
              .eq('id', item.product_id)
              .single();
            
            if (productData) {
              return {
                id: item.id,
                product: productData as Product
              };
            }
            return null;
          });

          const resolvedFavorites = (await Promise.all(favoritePromises)).filter(Boolean) as FavoriteItem[];
          setFavoriteItems(resolvedFavorites);
        }
      } catch (error) {
        console.error("Error in favorites fetch:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Save favorites to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem("favorites", JSON.stringify(favoriteItems));
    }
  }, [favoriteItems, user]);

  const addToFavorites = async (product: Product) => {
    if (user) {
      // For authenticated users, save to Supabase
      try {
        // Check if product already exists in favorites
        const { data: existingItem } = await supabase
          .from('favorites')
          .select()
          .eq('user_id', user.id)
          .eq('product_id', product.id)
          .single();

        if (existingItem) {
          toast({
            title: "Already in favorites",
            description: "This item is already in your favorites.",
            variant: "destructive"
          });
          return;
        }

        // Insert new favorite item
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id
          })
          .select()
          .single();

        if (error) throw error;
        
        // Add to local state
        if (data) {
          const newItem = {
            id: data.id,
            product
          };
          setFavoriteItems(prevItems => [...prevItems, newItem]);
          
          toast({
            title: "Added to favorites",
            description: `${product.name} has been added to your favorites.`,
          });
        }
      } catch (error) {
        console.error("Error adding to favorites:", error);
        toast({
          title: "Error",
          description: "There was a problem adding the item to your favorites.",
          variant: "destructive"
        });
      }
    } else {
      // For non-authenticated users, use localStorage
      const existingItem = favoriteItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        toast({
          title: "Already in favorites",
          description: "This item is already in your favorites.",
          variant: "destructive"
        });
        return;
      }

      const newItem = { 
        id: `${product.id}-${Date.now()}`,
        product
      };
      
      setFavoriteItems(prevItems => [...prevItems, newItem]);
      
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  const removeFromFavorites = async (productId: number) => {
    const favoriteItem = favoriteItems.find(item => item.product.id === productId);
    
    if (!favoriteItem) return;

    if (user) {
      // For authenticated users
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', favoriteItem.id);

        if (error) throw error;
        
        // Update local state
        setFavoriteItems(prevItems => prevItems.filter(item => item.product.id !== productId));
        
        toast({
          title: "Removed from favorites",
          description: `${favoriteItem.product.name} has been removed from your favorites.`,
        });
      } catch (error) {
        console.error("Error removing from favorites:", error);
        toast({
          title: "Error",
          description: "There was a problem removing the item from your favorites.",
          variant: "destructive"
        });
      }
    } else {
      // For non-authenticated users
      setFavoriteItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      
      toast({
        title: "Removed from favorites",
        description: `${favoriteItem.product.name} has been removed from your favorites.`,
      });
    }
  };

  const isFavorite = (productId: number) => {
    return favoriteItems.some(item => item.product.id === productId);
  };

  const clearFavorites = async () => {
    if (user) {
      // For authenticated users
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Clear local state
        setFavoriteItems([]);
        
        toast({
          title: "Favorites cleared",
          description: "All favorites have been removed.",
        });
      } catch (error) {
        console.error("Error clearing favorites:", error);
        toast({
          title: "Error",
          description: "There was a problem clearing your favorites.",
          variant: "destructive"
        });
      }
    } else {
      // For non-authenticated users
      setFavoriteItems([]);
      
      toast({
        title: "Favorites cleared",
        description: "All favorites have been removed.",
      });
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favoriteItems, 
      favoriteCount, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}