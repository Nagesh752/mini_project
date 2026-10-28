import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Plus, Check, Trash2, ArrowRight } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useCompare } from '../context/CompareContext';
import { formatINR } from '../utils/formatCurrency';
import { RatingStars } from '../components/common/RatingStars';

export const SavedProductsPage = () => {
  const { savedProducts, savedCount, removeSaved } = useSaved();
  const { isCompared, addToCompare, removeFromCompare, limitReached } = useCompare();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
              Saved Products
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            Keep track of items you find interesting and add them directly to your comparison list.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
          {savedCount} {savedCount === 1 ? 'Product' : 'Products'} Saved
        </div>
      </div>

      {/* Empty State */}
      {savedCount === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-content-primary">No Saved Products Yet</h2>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
              When browsing products or reviewing AI recommendations, click the heart icon on any card to save it here for later.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-xs sm:text-sm font-semibold hover:bg-brand-blue-hover shadow-xs"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Grid of Saved Products */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProducts.map(product => {
            const compared = isCompared(product.id);

            return (
              <div
                key={product.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-surface-border hover:shadow-card transition-all overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative aspect-4/3 w-full bg-slate-50 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeSaved(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-white shadow-xs transition-colors"
                    title="Remove from saved"
                    aria-label={`Remove ${product.name} from saved`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/90 rounded text-slate-800">
                      {product.brand}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                    <Link to={`/product/${product.id}`} className="block hover:text-brand-blue transition-colors">
                      <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-bold text-slate-900">{formatINR(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => (compared ? removeFromCompare(product.id) : addToCompare(product))}
                      disabled={limitReached && !compared}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                        compared
                          ? 'bg-blue-50 text-brand-blue border border-brand-blue/30'
                          : limitReached
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {compared ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-brand-blue" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Compare</span>
                        </>
                      )}
                    </button>

                    <Link
                      to={`/product/${product.id}`}
                      className="inline-flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
