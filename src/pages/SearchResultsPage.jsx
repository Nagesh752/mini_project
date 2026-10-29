import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { searchProductsApi } from '../services/api';
import { NaturalLanguageSearchBar } from '../components/search/NaturalLanguageSearchBar';
import { QueryInterpretationBadge } from '../components/search/QueryInterpretationBadge';
import { ProductGrid } from '../components/products/ProductGrid';
import { SearchFeedback } from '../components/feedback/SearchFeedback';
import { useCompare } from '../context/CompareContext';
import { useSearchHistory } from '../context/SearchHistoryContext';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';
  const { selectionCount } = useCompare();
  const { addSearchQuery } = useSearchHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [searchError, setSearchError] = useState('');
  const [currentQuery, setCurrentQuery] = useState(queryParam);
  const [searchData, setSearchData] = useState({
    interpretation: { originalQuery: queryParam, keySpecs: [] },
    results: [],
  });

  // Sync state when query parameter in URL changes
  useEffect(() => {
    setCurrentQuery(queryParam);
    if (queryParam.trim()) {
      addSearchQuery(queryParam.trim());
    }

    setIsLoading(true);
    setSearchError('');
    setSearchData({ interpretation: { originalQuery: queryParam, keySpecs: [] }, results: [] });
    let isMounted = true;
    const controller = new AbortController();

    if (!queryParam.trim()) {
      setIsLoading(false);
      setSearchData({ interpretation: { originalQuery: '', keySpecs: [] }, results: [] });
      return () => { isMounted = false; controller.abort(); };
    }

    searchProductsApi(queryParam, undefined, undefined, undefined, controller.signal)
      .then(data => {
        if (isMounted) {
          setSearchData(data);
          setIsLoading(false);
        }
      })
      .catch(error => {
        if (isMounted && error.name !== 'AbortError') {
          setSearchError(error.message || 'Product search failed. Please try again.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [queryParam]);

  const handleNewSearch = (newQuery) => {
    if (!newQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setSearchError('');
    setSearchData({ interpretation: { originalQuery: queryParam, keySpecs: [] }, results: [] });
    try {
      const data = await searchProductsApi(queryParam);
      setSearchData(data);
    } catch (error) {
      setSearchError(error.message || 'Product search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const { interpretation, results } = searchData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Search Header Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              AI Product Discovery
            </h1>
            <p className="text-xs sm:text-sm text-content-secondary">
              Natural language requirement matching without manual filters.
            </p>
          </div>

          {/* Comparison quick status */}
          {selectionCount > 0 && (
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-semibold self-start sm:self-auto hover:bg-blue-100 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{selectionCount} of 5 selected for comparison</span>
            </Link>
          )}
        </div>

        {/* Editable search input */}
        <div className="max-w-3xl">
          <NaturalLanguageSearchBar
            initialValue={currentQuery}
            onSearch={handleNewSearch}
            size="normal"
            placeholder="Edit or refine your requirements…"
            showHelperNote={false}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800">Analyzing Your Requirements…</h3>
            <p className="text-xs text-slate-500">
              Evaluating budget constraints, specifications, and ranking matches
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Simulated AI Interpretation Banner */}
          {queryParam && (
            <QueryInterpretationBadge
              interpretation={interpretation}
              totalFound={results.length}
            />
          )}

          {/* Results State */}
          {results.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing <strong className="text-slate-800">{results.length}</strong> top matching results
                </span>
                <span>Sorted by semantic relevance</span>
              </div>

              {/* Product Cards Grid */}
              <ProductGrid products={results} searchQuery={queryParam} />

              {/* Feedback After Search Results */}
              <SearchFeedback query={queryParam} />
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm my-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-content-primary">{searchError ? 'Search Could Not Be Completed' : 'No Products Found'}</h3>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {searchError || `The shopping provider returned no matching listings for “${queryParam}”. Try a broader query or adjust your requirements.`}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                {searchError && (
                  <button type="button" onClick={handleRetry} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
                    Retry search
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleNewSearch('Laptop under ₹60,000 for coding')}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                >
                  Try: &ldquo;Laptop under ₹60,000 for coding&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => handleNewSearch('Wireless headphones with long battery life')}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                >
                  Try: &ldquo;Wireless headphones with long battery life&rdquo;
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
