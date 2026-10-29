import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data/products';
import { addToWishlistApi, removeFromWishlistApi } from '../services/api';

const STORAGE_KEY = 'ai_shop_saved_products_ids';

const SavedContext = createContext(undefined);

export const SavedProvider = ({ children }) => {
  const [savedProductIds, setSavedProductIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProductIds));
    } catch (e) {
      console.error('Failed to persist saved products', e);
    }
  }, [savedProductIds]);

  const toggleSave = (productId) => {
    setSavedProductIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        removeFromWishlistApi(productId).catch(() => {});
        return prev.filter(id => id !== productId);
      } else {
        addToWishlistApi(productId).catch(() => {});
        return [...prev, productId];
      }
    });
  };

  const removeSaved = (productId) => {
    removeFromWishlistApi(productId).catch(() => {});
    setSavedProductIds(prev => prev.filter(id => id !== productId));
  };

  const isSaved = (productId) => savedProductIds.includes(productId);

  const savedProducts = MOCK_PRODUCTS.filter(p => savedProductIds.includes(p.id));
  const savedCount = savedProductIds.length;

  return (
    <SavedContext.Provider
      value={{
        savedProductIds,
        savedProducts,
        savedCount,
        toggleSave,
        isSaved,
        removeSaved,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
