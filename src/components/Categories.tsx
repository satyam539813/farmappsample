import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryList } from '@/data/categories';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf, Star } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${categoryName.toLowerCase()}`);
  };

  return (
    <section id="categories" className="py-24 bg-gradient-to-br from-background via-muted/10 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-20 w-40 h-40 bg-farm-green rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-farm-accent-yellow rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-farm-accent-red rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-farm-green/20 to-farm-green/10 mb-6 animate-bounce">
            <Leaf className="h-10 w-10 text-farm-green" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-farm-green via-farm-green-dark to-farm-green bg-clip-text text-transparent">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated selection of fresh, organic produce organized by category. 
            Each category features the finest seasonal offerings from our trusted local farmers.
          </p>
        </div>

        {/* Enhanced Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {categoryList.map((category, index) => (
            <Card 
              key={category.id} 
              className="group overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-700 hover:scale-105 cursor-pointer animate-fade-in rounded-3xl"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="relative h-80 overflow-hidden rounded-3xl">
                {/* Image with overlay gradient */}
                <div className="absolute inset-0">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg transform transition-all duration-500 group-hover:scale-110">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-farm-accent-yellow fill-current" />
                    <span className="text-sm font-bold text-farm-green-dark">{category.count}</span>
                  </div>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <CardContent className="text-white p-0 space-y-4">
                    {/* Category name with enhanced styling */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-farm-accent-yellow transition-colors duration-300">
                        {category.name}
                      </h3>
                      <div className="w-12 h-1 bg-farm-green rounded-full transition-all duration-500 group-hover:w-20 group-hover:bg-farm-accent-yellow"></div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-2 transition-all duration-300 group-hover:text-white">
                      {category.description}
                    </p>
                    
                    {/* Enhanced button */}
                    <Button 
                      variant="secondary" 
                      className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-farm-green-dark rounded-full py-6 font-semibold transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>Explore {category.name}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Button>
                  </CardContent>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-farm-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 p-10 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-full border border-border/50 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-farm-green to-farm-green-dark flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-farm-green-dark to-farm-green bg-clip-text text-transparent">
                Discover All Categories
              </h3>
              <p className="text-gray-600 max-w-md">
                Browse our complete selection of farm-fresh produce and artisanal goods
              </p>
            </div>
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-farm-green to-farm-green-dark hover:from-farm-green-dark hover:to-farm-green text-white rounded-full px-10 py-6 font-semibold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 group"
            >
              <span className="flex items-center space-x-3">
                <span>View All Categories</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;