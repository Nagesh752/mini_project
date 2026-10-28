import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({
  products = [],
  searchQuery,
  showFeedback = true,
  className = '',
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          searchQuery={searchQuery}
          showFeedback={showFeedback}
        />
      ))}
    </div>
  );
};
