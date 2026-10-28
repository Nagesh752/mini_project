import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data/products';

const SEARCH_HISTORY_KEY = 'ai_shop_search_history';
const RECENTLY_VIEWED_KEY = 'ai_shop_recently_viewed';

const SearchHistoryContext = createContext(undefined);

export const SearchHistoryProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored
        ? JSON.parse(stored)
        : [
            'Laptop under ₹60,000 for coding with 16GB RAM',
            'Wireless headphones with long battery life',
            'Monitor for programming under ₹15,000',
          ];
    } catch {
      return [];
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : ['lap-1', 'head-1', 'mon-1'];
    } catch {
      return ['lap-1', 'head-1', 'mon-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.error('Failed to sync search history', e);
    }
  }, [recentSearches]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewedIds));
    } catch (e) {
      console.error('Failed to sync recently viewed', e);
    }
  }, [recentlyViewedIds]);

  const addSearchQuery = (query) => {
    const trimmed = (query || '').trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 8);
    });
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
  };

  const addRecentlyViewed = (productId) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 6);
    });
  };

  const recentlyViewedProducts = recentlyViewedIds
    .map(id => MOCK_PRODUCTS.find(p => p.id === id))
    .filter(Boolean);

  return (
    <SearchHistoryContext.Provider
      value={{
        recentSearches,
        addSearchQuery,
        clearSearchHistory,
        recentlyViewedProducts,
        addRecentlyViewed,
      }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
};

export const useSearchHistory = () => {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  return context;
};
