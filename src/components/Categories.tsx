
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    name: 'Fresh Vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    count: 42,
  },
  {
    id: 2,
    name: 'Organic Fruits',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
    count: 36,
  },
  {
    id: 3,
    name: 'Dairy Products',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
    count: 28,
  },
  {
    id: 4,
    name: 'Fresh Herbs',
    image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=600&q=80',
    count: 15,
  },
  {
    id: 5,
    name: 'Artisan Bread',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    count: 22,
  },
  {
    id: 6,
    name: 'Organic Honey',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=600&q=80',
    count: 18,
  },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <a href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`} key={category.id}>
              <Card className="overflow-hidden card-hover h-[220px]">
                <div className="relative h-full">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <CardContent className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p>{category.count} Products</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
