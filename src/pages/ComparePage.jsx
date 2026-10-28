import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Trash2,
  Plus,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Search
} from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { rankSelectedProducts } from '../utils/rankProducts';
import { TopRecommendations } from '../components/comparison/TopRecommendations';
import { ComparisonMatrix } from '../components/comparison/ComparisonMatrix';
import { MOCK_PRODUCTS } from '../data/products';
import { formatINR } from '../utils/formatCurrency';

export const ComparePage = () => {
  const {
    selectedProducts,
    selectionCount,
    canCompare,
    limitReached,
    alertMessage,
    addToCompare,
    removeFromCompare,
    clearCompare,
  } = useCompare();

  const [filterQuery, setFilterQuery] = useState('');

  // Dynamically rank selected products
  const { topRecommendations, otherCompared, allRanked } = useMemo(() => {
    return rankSelectedProducts(selectedProducts);
  }, [selectedProducts]);

  // Quick candidate products that can be added (not currently selected)
  const candidateProducts = useMemo(() => {
    const selectedIds = new Set(selectedProducts.map(p => p.id));
    return MOCK_PRODUCTS.filter(p => !selectedIds.has(p.id)).filter(p => {
      if (!filterQuery.trim()) return true;
      const q = filterQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [selectedProducts, filterQuery]);

  const scrollToSelection = () => {
    const element = document.getElementById('product-selection-manager');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-28">
      {/* Page Header */}
      <div className="border-b border-surface-border pb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
                Product Comparison & Recommendations
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-content-secondary mt-1">
              Select 2 to 5 products for side-by-side spec evaluation and AI-assisted top 3 ranking.
            </p>
          </div>

          {selectionCount > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={clearCompare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Selection</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Selection Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Selection Status: <span className="text-brand-blue">{selectionCount} of 5</span> products selected
            </span>
            {limitReached && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[11px]">
                Maximum 5 Limit Reached
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            {selectionCount < 2 ? (
              <span className="text-amber-700 font-medium">
                ⚠️ Need at least {2 - selectionCount} more product to compare
              </span>
            ) : (
              <span className="text-teal-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Comparison ready ({selectionCount} products active)
              </span>
            )}
          </div>
        </div>

        {alertMessage && (
          <div className="p-3 bg-amber-500 text-white rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{alertMessage}</span>
          </div>
        )}
      </div>

      {/* Case 0: No Products Selected */}
      {selectionCount === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-xl mx-auto space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-sm">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-content-primary">No Products Selected Yet</h2>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
              To compare specifications and receive top algorithmic recommendations, select 2 to 5 products from search results or the catalog.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs sm:text-sm font-semibold hover:bg-brand-blue-hover shadow-xs"
            >
              <span>Explore Product Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-200"
            >
              <span>Natural Language Search</span>
            </Link>
          </div>
        </div>
      )}

      {/* Case 1: Exactly 1 Product Selected (Needs 1 more) */}
      {selectionCount === 1 && (
        <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                1 of 5 Selected
              </span>
              <h2 className="text-xl font-bold text-content-primary">
                Add at least 1 more product to enable comparison
              </h2>
              <p className="text-xs text-content-secondary">
                Comparison requires at least 2 products. Pick an additional product below to immediately view the side-by-side analysis.
              </p>
            </div>
          </div>

          {/* Current single product */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md">
            <img
              src={selectedProducts[0].image}
              alt={selectedProducts[0].name}
              className="w-16 h-16 object-cover rounded-xl bg-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {selectedProducts[0].brand}
              </span>
              <h4 className="text-xs font-semibold text-slate-900 truncate">
                {selectedProducts[0].name}
              </h4>
              <p className="text-xs font-bold text-brand-blue">{formatINR(selectedProducts[0].price)}</p>
            </div>
            <button
              type="button"
              onClick={() => removeFromCompare(selectedProducts[0].id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick candidates to add with 1 click */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Quickly Add a Similar Product:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {candidateProducts
                .filter(p => p.category === selectedProducts[0].category)
                .slice(0, 3)
                .map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] font-bold text-brand-blue">{formatINR(item.price)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCompare(item)}
                      className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover rounded-lg flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Case 2: 2 to 5 Products Selected (Full Comparison & Top Recommendations Workflow) */}
      {canCompare && (
        <div className="space-y-12">
          {/* Step 3: Top Recommendations for You (Section 7) */}
          <TopRecommendations
            topRecommendations={topRecommendations}
            otherCompared={otherCompared}
            onChangeSelection={scrollToSelection}
          />

          {/* Step 2: Full Detailed Side-by-Side Comparison Matrix */}
          <ComparisonMatrix
            products={allRanked}
            onRemoveProduct={removeFromCompare}
          />

          {/* Product Selection Manager (Allows adding/removing dynamically without leaving page) */}
          <div
            id="product-selection-manager"
            className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 space-y-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-content-primary">
                  Manage Comparison Selection ({selectionCount} of 5 Selected)
                </h3>
                <p className="text-xs text-content-secondary">
                  Add or remove products below. The top 3 recommendations and matrix update in real time.
                </p>
              </div>

              {limitReached ? (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Maximum 5 products reached
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  You can select up to {5 - selectionCount} more products
                </span>
              )}
            </div>

            {/* Currently Selected Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {selectedProducts.map(p => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between space-y-2 relative"
                >
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                      <p className="text-[11px] font-bold text-brand-blue">{formatINR(p.price)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(p.id)}
                    className="w-full py-1 text-center text-[11px] font-semibold text-rose-600 bg-white hover:bg-rose-50 rounded-md border border-rose-200 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Add More from Catalog */}
            {!limitReached && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Add Another Product ({candidateProducts.length} Available):
                  </h4>
                  <div className="relative max-w-xs w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={filterQuery}
                      onChange={e => setFilterQuery(e.target.value)}
                      placeholder="Filter candidates…"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                  {candidateProducts.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-200 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[11px] font-bold text-brand-blue">{formatINR(p.price)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCompare(p)}
                        className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors flex-shrink-0"
                        title="Add to comparison"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
