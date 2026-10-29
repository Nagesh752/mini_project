import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';

export const NaturalLanguageSearchBar = ({
  initialValue = '',
  onSearch,
  placeholder = "Describe the product you're looking for…",
  autoFocus = false,
  size = 'large',
  showHelperNote = true,
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const isLarge = size === 'large';

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div
          className={`relative flex items-center bg-white rounded-2xl border transition-all duration-200 ${
            query.trim()
              ? 'border-brand-blue/50 shadow-md ring-4 ring-blue-500/10'
              : 'border-slate-200 shadow-sm hover:border-slate-300 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-blue-500/10'
          }`}
        >
          {/* Icon */}
          <div className="pl-4 sm:pl-5 text-slate-400 group-focus-within:text-brand-blue transition-colors flex items-center">
            <Sparkles className={isLarge ? 'w-5 h-5 text-brand-blue' : 'w-4 h-4 text-brand-blue'} />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`w-full bg-transparent text-content-primary placeholder:text-slate-400 focus:outline-none ${
              isLarge ? 'py-4 px-3 sm:px-4 text-base sm:text-lg' : 'py-2.5 px-3 text-sm sm:text-base'
            }`}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          <div className="pr-2 sm:pr-2.5 py-1.5">
            <button
              type="submit"
              disabled={!query.trim()}
              className={`inline-flex items-center justify-center font-medium text-white bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-40 disabled:hover:bg-brand-blue rounded-xl transition-all shadow-sm ${
                isLarge ? 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base gap-2' : 'px-3 py-2 text-sm gap-1.5'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="w-3.5 h-3.5 sm:hidden" />
            </button>
          </div>
        </div>
      </form>

      {showHelperNote && (
        <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2.5 text-xs text-slate-500">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          <span>No complicated filters. Just tell us what you need in natural English.</span>
        </div>
      )}
    </div>
  );
};
