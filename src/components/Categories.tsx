
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryList } from '@/data/categories';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${categoryName.toLowerCase()}`);
  };

  return (
    <section id="categories" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryList.map((category) => (
            <Card 
              key={category.id} 
              className="overflow-hidden card-hover h-[280px] cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="relative h-full">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <CardContent className="text-white p-0">
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm mb-3">{category.count} Products</p>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">{category.description}</p>
                    <Button variant="secondary" size="sm" className="w-full">
                      Shop Now
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/shop')}
            variant="outline" 
            className="px-8 py-6 border-farm-green text-farm-green rounded-full hover:bg-farm-green/10"
          >
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
