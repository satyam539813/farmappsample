
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveFilters({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-farm-green-dark">Shop All Products</h1>
          {(activeCategory || Object.keys(activeFilters).length > 0) && (
            <Button variant="outline" onClick={clearFilters} className="text-farm-green hover:text-white hover:bg-farm-green">
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 space-y-6">
            <ProductFilters 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
            />
          </aside>
          
          <Separator orientation="vertical" className="h-auto hidden lg:block" />
          
          <div className="flex-1">
            <ProductGrid 
              activeCategory={activeCategory} 
              activeFilters={activeFilters}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
