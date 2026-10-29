import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, MessageSquare, Layers, Award, ArrowRight, ShieldCheck, Zap, History } from 'lucide-react';
import { NaturalLanguageSearchBar } from '../components/search/NaturalLanguageSearchBar';
import { ExamplePrompts } from '../components/search/ExamplePrompts';
import { ProductCard } from '../components/products/ProductCard';
import { MOCK_PRODUCTS } from '../data/products';
import { useSearchHistory } from '../context/SearchHistoryContext';

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { recentlyViewedProducts, addSearchQuery } = useSearchHistory();

  const handleSearch = (query) => {
    if (!query.trim()) return;
    addSearchQuery(query.trim());
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectPrompt = (prompt) => {
    setSearchQuery(prompt);
  };

  // Featured recommendations across diverse categories
  const featuredProducts = [
    MOCK_PRODUCTS.find(p => p.id === 'lap-1'),
    MOCK_PRODUCTS.find(p => p.id === 'phone-1'),
    MOCK_PRODUCTS.find(p => p.id === 'head-1'),
    MOCK_PRODUCTS.find(p => p.id === 'mon-1'),
  ].filter(Boolean);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden">
        {/* Subtle decorative background gradient circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/80 via-teal-50/30 to-transparent -z-10 blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-semibold shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Next-Generation Natural Language Shopping</span>
          </div>

          {/* Main Headings */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-content-primary tracking-tight leading-[1.15]">
              Shopping, Made Smarter <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-blue via-blue-600 to-teal-500 bg-clip-text text-transparent">
                with AI.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-content-secondary leading-relaxed">
              Tell us what you need. Discover products that fit your budget, preferences, and priorities.
            </p>
          </div>

          {/* Large Natural Language Search Box */}
          <div className="max-w-2xl mx-auto text-left">
            <NaturalLanguageSearchBar
              initialValue={searchQuery}
              onSearch={handleSearch}
              size="large"
              placeholder="Describe the product you're looking for…"
            />
          </div>

          {/* Clickable Example Prompts */}
          <div className="max-w-2xl mx-auto text-left pt-2">
            <ExamplePrompts
              onSelectPrompt={handleSelectPrompt}
              activePrompt={searchQuery}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-content-primary">
            How AI-Assisted Shopping Works
          </h2>
          <p className="text-sm text-content-secondary">
            Skip tedious filter checkboxes and category dropdowns. Our 3-step pipeline extracts your needs and finds optimal products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-surface-border shadow-sm hover:shadow-card transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">Step 1</span>
              <h3 className="text-lg font-bold text-content-primary">Describe</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Type your requirements in plain English, including budget, intended use case, and specific hardware specs.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 italic">
              &ldquo;Laptop under ₹60,000 for coding with 16GB RAM&rdquo;
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-surface-border shadow-sm hover:shadow-card transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Step 2</span>
              <h3 className="text-lg font-bold text-content-primary">Discover</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                The assistant parses category constraints, budget ceilings, and intent, retrieving relevant products without manual menus.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
              ⚡ Analyzes: Budget (₹60k) • RAM (16GB) • Purpose (Development)
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-surface-border shadow-sm hover:shadow-card transition-all space-y-4 relative group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 3</span>
              <h3 className="text-lg font-bold text-content-primary">Compare & Recommend</h3>
              <p className="text-xs text-content-secondary leading-relaxed">
                Pick 2 to 5 items to compare side-by-side. The ranking engine pinpoints the top recommendations with clear rationales.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600">
              🏆 Transparent scoring breakdown & #1 Best Match highlight
            </div>
          </div>
        </div>
      </section>

      {/* Popular Product Recommendations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-brand-blue" />
              <h2 className="text-2xl font-bold text-content-primary">
                Popular Recommendations
              </h2>
            </div>
            <p className="text-sm text-content-secondary">
              Highly rated items frequently chosen by tech professionals and students.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-blue hover:text-brand-blue-hover self-start sm:self-auto"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recently Viewed Products (when available) */}
      {recentlyViewedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-content-primary">
              Recently Viewed Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewedProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Trust & Architecture Explainer Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 sm:p-12 shadow-elevated relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Prototype Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Designed for Natural Conversation, Engineered for Future Scalability.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              This frontend prototype demonstrates an end-to-end shopping workflow driven entirely by user requirements. The modular code organization allows direct plug-and-play integration with a Python FastAPI backend, MongoDB database, and LLM embedding services.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm transition-colors"
              >
                <span>Try Product Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/feedback"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <span>Provide Feedback</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
