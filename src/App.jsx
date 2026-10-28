import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { SavedProvider } from './context/SavedContext';
import { SearchHistoryProvider } from './context/SearchHistoryContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ComparisonBar } from './components/comparison/ComparisonBar';

import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ComparePage } from './pages/ComparePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { SavedProductsPage } from './pages/SavedProductsPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { AccountPage } from './pages/AccountPage';

// Helper component that scrolls window to top upon route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompareProvider>
          <SavedProvider>
            <SearchHistoryProvider>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen bg-surface-bg text-content-primary">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/compare" element={<ComparePage />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/saved" element={<SavedProductsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    {/* Fallback route */}
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </main>
                <ComparisonBar />
                <Footer />
              </div>
            </SearchHistoryProvider>
          </SavedProvider>
        </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
