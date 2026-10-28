import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data/products';
import { ProductGrid } from '../components/products/ProductGrid';
import { NaturalLanguageSearchBar } from '../components/search/NaturalLanguageSearchBar';
import { useCompare } from '../context/CompareContext';

export const ExplorePage = () => {
  const navigate = useNavigate();
  const { selectionCount } = useCompare();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickQuery] = useState('');

  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'laptop', label: 'Laptops' },
    { id: 'smartphone', label: 'Smartphones' },
    { id: 'headphones', label: 'Headphones & Audio' },
    { id: 'monitor', label: 'Monitors & Displays' },
  ];

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesQuick =
      !quickQuery.trim() ||
      product.name.toLowerCase().includes(quickQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(quickQuery.toLowerCase()) ||
      (product.tags || []).some(t => t.toLowerCase().includes(quickQuery.toLowerCase()));

    return matchesCategory && matchesQuick;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              Explore Catalog
            </h1>
            <p className="text-xs sm:text-sm text-content-secondary">
              Browse our curated hardware catalogue or use the AI natural language search above.
            </p>
          </div>

          {selectionCount > 0 && (
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200 self-start sm:self-auto flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{selectionCount} of 5 items selected for comparison</span>
            </div>
          )}
        </div>

        {/* AI Natural language bar */}
        <div className="max-w-3xl">
          <NaturalLanguageSearchBar
            onSearch={handleSearch}
            placeholder="Type your needs: e.g. 'Laptop with 16GB RAM under 60k'…"
            size="normal"
            showHelperNote={false}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-brand-blue text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product List Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{filteredProducts.length}</strong> products
        </span>
        <span>Pick any 2 to 5 products to compare them side by side</span>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
};
