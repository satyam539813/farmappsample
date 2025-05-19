
import React from 'react';
import { useState } from 'react';
import { products } from '@/data/products';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';

// Define a type for our product
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image?: string;
  image_url?: string;
  discount?: boolean;
  oldPrice?: number;
  badge?: string;
  organic?: boolean;
  description: string;
}

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { addToCart } = useCart();

  // Filter products based on active tab
  const filteredProducts = activeTab === "all" 
    ? products
    : products.filter(product => 
        product.category.toLowerCase() === activeTab.toLowerCase()
      );
  
  const categories = ["all", ...new Set(products.map(product => product.category.toLowerCase()))];

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our hand-picked selection of fresh, organic produce delivered straight from local farms to your doorstep.
        </p>
        
        <Tabs defaultValue="all" className="w-full max-w-3xl mx-auto mb-12">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {categories.map((category: string) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="capitalize"
                onClick={() => setActiveTab(category)}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product: Product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image || product.image_url || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-muted-foreground text-sm">{product.category}</p>
                  </div>
                  <span className="text-farm-green font-bold">${product.price.toFixed(2)}/{product.unit}</span>
                </div>
                
                <p className="text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <Button 
                  className="w-full bg-farm-green hover:bg-farm-green-dark"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
