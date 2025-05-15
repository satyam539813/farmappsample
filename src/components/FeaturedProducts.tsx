
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

// Sample product data
const products = [
  {
    id: 1,
    name: "Organic Red Apples",
    category: "Fruits",
    price: 4.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    discount: true,
    oldPrice: 6.99,
    badge: "Sale"
  },
  {
    id: 2,
    name: "Fresh Garden Spinach",
    category: "Vegetables",
    price: 3.49,
    unit: "bunch",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    organic: true
  },
  {
    id: 3,
    name: "Free Range Eggs",
    category: "Dairy",
    price: 5.99,
    unit: "dozen",
    image: "https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=600&q=80",
    badge: "New"
  },
  {
    id: 4,
    name: "Heirloom Tomatoes",
    category: "Vegetables",
    price: 4.29,
    unit: "lb",
    image: "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=600&q=80",
    organic: true
  }
];

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="product-card card-hover">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[200px] object-cover"
                />
                {product.badge && (
                  <Badge className={`absolute top-2 right-2 ${
                    product.badge === "Sale" 
                      ? "bg-farm-accent-red" 
                      : "bg-farm-accent-blue"
                  }`}>
                    {product.badge}
                  </Badge>
                )}
                {product.organic && (
                  <Badge className="absolute top-2 left-2 bg-farm-green">
                    Organic
                  </Badge>
                )}
              </div>
              <CardContent className="pt-4 pb-2">
                <p className="text-sm text-farm-green">{product.category}</p>
                <h3 className="font-semibold text-lg mb-1 text-farm-green-dark">{product.name}</h3>
                <div className="flex items-center">
                  <span className="text-xl font-bold">${product.price}</span>
                  <span className="text-sm text-gray-500 ml-1">/ {product.unit}</span>
                  {product.discount && (
                    <span className="ml-2 text-sm line-through text-gray-400">
                      ${product.oldPrice}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full bg-farm-green hover:bg-farm-green-dark" onClick={() => handleAddToCart(product.id)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/shop">
            <Button variant="outline" className="px-8 py-6 border-farm-green text-farm-green rounded-full hover:bg-farm-green/10">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
