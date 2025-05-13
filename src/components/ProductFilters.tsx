
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { categoryList } from '@/data/categories';

interface ProductFiltersProps {
  activeCategory: string | null;
  activeFilters: Record<string, any>;
  onCategoryChange: (category: string | null) => void;
  onFilterChange: (filters: Record<string, any>) => void;
}

const ProductFilters = ({ 
  activeCategory, 
  activeFilters, 
  onCategoryChange, 
  onFilterChange 
}: ProductFiltersProps) => {
  
  const handleCheckboxChange = (key: string) => {
    const newFilters = { ...activeFilters };
    newFilters[key] = !newFilters[key];
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (values: number[]) => {
    const newFilters = { ...activeFilters, priceRange: values };
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => onCategoryChange(null)}
              className={`text-left w-full px-3 py-2 rounded-md hover:bg-[#F2FCE2] transition-colors ${!activeCategory ? 'font-medium text-farm-green bg-[#F2FCE2]' : 'text-gray-600 hover:text-farm-green'}`}
            >
              All Products
            </button>
          </li>
          {categoryList.map((category) => (
            <li key={category.id}>
              <button 
                onClick={() => onCategoryChange(category.name)}
                className={`text-left w-full px-3 py-2 rounded-md hover:bg-[#F2FCE2] transition-colors ${
                  activeCategory === category.name ? 'font-medium text-farm-green bg-[#F2FCE2]' : 'text-gray-600 hover:text-farm-green'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Filters</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 p-2 hover:bg-[#F2FCE2] rounded-md transition-colors">
            <Checkbox 
              id="organic" 
              checked={!!activeFilters.organic}
              onCheckedChange={() => handleCheckboxChange('organic')}
            />
            <label
              htmlFor="organic"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Organic Products
            </label>
          </div>
          <div className="flex items-center space-x-2 p-2 hover:bg-[#F2FCE2] rounded-md transition-colors">
            <Checkbox 
              id="sale" 
              checked={!!activeFilters.onSale}
              onCheckedChange={() => handleCheckboxChange('onSale')}
            />
            <label
              htmlFor="sale"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              On Sale
            </label>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 50]}
            max={50}
            step={1}
            value={activeFilters.priceRange || [0, 50]}
            onValueChange={handlePriceRangeChange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${activeFilters.priceRange ? activeFilters.priceRange[0] : 0}</span>
            <span>${activeFilters.priceRange ? activeFilters.priceRange[1] : 50}+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
