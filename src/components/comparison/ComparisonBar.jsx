import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers, X, ArrowRight, AlertCircle, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { formatINR } from '../../utils/formatCurrency';

export const ComparisonBar = () => {
  const {
    selectedProducts,
    selectionCount,
    canCompare,
    limitReached,
    alertMessage,
    removeFromCompare,
    clearCompare,
    dismissAlert,
  } = useCompare();

  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // If on the /compare page itself, we can hide the floating dock or keep it minimal
  const isComparePage = location.pathname === '/compare';

  if (selectionCount === 0 && !alertMessage) {
    return null;
  }

  const handleCompareClick = () => {
    if (canCompare) {
      navigate('/compare');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 pb-3 sm:pb-5">
        <div className="pointer-events-auto space-y-2">
          {/* Notification Alert if limit reached or duplicate attempted */}
          {alertMessage && (
            <div className="flex items-center justify-between gap-3 p-3 bg-amber-500 text-white rounded-xl shadow-lg animate-fade-in text-xs sm:text-sm font-medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{alertMessage}</span>
              </div>
              <button
                type="button"
                onClick={dismissAlert}
                className="p-1 hover:bg-amber-600 rounded-md transition-colors"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Floating Comparison Dock (only if selectionCount > 0) */}
          {selectionCount > 0 && !isComparePage && (
            <div className="glass-panel bg-white/95 backdrop-blur-md rounded-2xl shadow-elevated border border-slate-200/90 overflow-hidden transition-all">
              {/* Header Bar */}
              <div className="px-4 py-2.5 sm:px-6 flex items-center justify-between bg-slate-50/80 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-xs">
                    {selectionCount}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-content-primary">
                    <span className="text-brand-blue font-bold">{selectionCount} of 5</span> products selected for comparison
                  </span>
                  {limitReached && (
                    <span className="hidden sm:inline text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Limit reached (max 5)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearCompare}
                    className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50 transition-colors"
                    aria-label={isExpanded ? 'Collapse dock' : 'Expand dock'}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expandable Product Previews & Compare Trigger */}
              {isExpanded && (
                <div className="p-3 sm:4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 animate-fade-in">
                  {/* Thumbnails Row */}
                  <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
                    {selectedProducts.map(item => (
                      <div
                        key={item.id}
                        className="group relative flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg bg-slate-100 flex-shrink-0"
                        />
                        <div className="max-w-[110px] sm:max-w-[130px]">
                          <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] font-bold text-brand-blue">{formatINR(item.price)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(item.id)}
                          className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                          title="Remove from comparison"
                          aria-label={`Remove ${item.name} from comparison`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Empty Slots Indicator */}
                    {Array.from({ length: 5 - selectionCount }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="hidden lg:flex items-center justify-center w-28 h-12 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px] font-medium"
                      >
                        + Add slot
                      </div>
                    ))}
                  </div>

                  {/* Compare Action Button */}
                  <div className="w-full md:w-auto flex items-center justify-end gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleCompareClick}
                      disabled={!canCompare}
                      className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                        canCompare
                          ? 'bg-brand-blue text-white hover:bg-brand-blue-hover hover:shadow-md cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>Compare Selected ({selectionCount})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Notice when only 1 product is selected */}
              {!canCompare && isExpanded && (
                <div className="px-4 py-1.5 bg-blue-50/60 border-t border-blue-100/60 text-[11px] text-brand-blue text-center">
                  💡 Select at least <strong>2 products</strong> (up to 5) to unlock side-by-side comparison & recommendation ranking.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
