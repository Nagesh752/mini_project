import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data/products';

const STORAGE_KEY = 'ai_shop_compare_product_ids';
const MAX_COMPARE_LIMIT = 5;
const MIN_COMPARE_REQUIRED = 2;

const CompareContext = createContext(undefined);

export const CompareProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        return MOCK_PRODUCTS.filter(p => ids.includes(p.id)).slice(0, MAX_COMPARE_LIMIT);
      }
    } catch (e) {
      console.error('Failed to load compare list from localStorage', e);
    }
    return [];
  });

  const [alertMessage, setAlertMessage] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      const ids = selectedProducts.map(p => p.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to persist compare list', e);
    }
  }, [selectedProducts]);

  // Clear alert after 4 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const addToCompare = (product) => {
    // 1. Check if already selected
    if (selectedProducts.some(p => p.id === product.id)) {
      setAlertMessage(`"${product.name}" is already in your comparison list.`);
      return false;
    }

    // 2. Check maximum limit of 5
    if (selectedProducts.length >= MAX_COMPARE_LIMIT) {
      setAlertMessage(`Maximum limit reached! You can compare up to 5 products at a time. Remove one to add this.`);
      return false;
    }

    setSelectedProducts(prev => [...prev, product]);
    setAlertMessage(null);
    return true;
  };

  const removeFromCompare = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setSelectedProducts([]);
    setAlertMessage(null);
  };

  const isCompared = (productId) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const dismissAlert = () => setAlertMessage(null);

  const selectionCount = selectedProducts.length;
  const canCompare = selectionCount >= MIN_COMPARE_REQUIRED;
  const limitReached = selectionCount >= MAX_COMPARE_LIMIT;

  return (
    <CompareContext.Provider
      value={{
        selectedProducts,
        selectionCount,
        canCompare,
        limitReached,
        alertMessage,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
        dismissAlert,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
