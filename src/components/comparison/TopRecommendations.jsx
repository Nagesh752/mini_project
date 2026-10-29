import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, CheckCircle2, Heart, ArrowRight, BarChart2 } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';
import { useSaved } from '../../context/SavedContext';

export const TopRecommendations = ({
  topRecommendations = [],
  otherCompared = [],
  onChangeSelection,
}) => {
  const { isSaved, toggleSave } = useSaved();

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-content-primary">
              Top Recommendations for You
            </h2>
          </div>
          <p className="text-sm text-content-secondary">
            Multi-factor algorithmic ranking of your {topRecommendations.length + otherCompared.length} selected items, scored on requirement fit, budget suitability, and verified ratings.
          </p>
        </div>

        <button
          type="button"
          onClick={onChangeSelection}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors self-start sm:self-auto"
        >
          Change Selection
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topRecommendations.map(product => {
          const saved = isSaved(product.id);
          const breakdown = product.scoreBreakdown || { requirementMatch: 30 };

          return (
            <div
              key={product.id}
              className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                product.isBestMatch
                  ? 'border-brand-blue shadow-elevated ring-2 ring-blue-500/20'
                  : 'border-surface-border shadow-card hover:border-slate-300'
              }`}
            >
              {/* Rank Banner */}
              <div
                className={`px-4 py-2.5 flex items-center justify-between text-xs font-semibold ${
                  product.isBestMatch
                    ? 'bg-gradient-to-r from-brand-blue to-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {product.isBestMatch ? (
                    <>
                      <Crown className="w-4 h-4 text-amber-300" />
                      <span className="font-bold tracking-wide">Rank #1 • Best Match</span>
                    </>
                  ) : (
                    <span>Rank #{product.rank} Recommendation</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] opacity-90">
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Score: {product.score}/100</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Image & Title */}
                  <div className="flex gap-4 items-start">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-slate-50 flex-shrink-0 border border-slate-100"
                    />
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase text-slate-500">
                        {product.brand}
                      </span>
                      <Link to={`/product/${product.id}`} className="block hover:text-brand-blue transition-colors">
                        <h4 className="font-semibold text-sm text-content-primary line-clamp-2 leading-snug">
                          {product.name}
                        </h4>
                      </Link>
                      <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                    </div>
                  </div>

                  {/* Price & Budget Suitability */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xl font-bold text-content-primary">
                      {formatINR(product.price)}
                    </div>
                    <Badge
                      variant={product.budgetSuitability === 'Within Budget' || product.budgetSuitability === 'Well Under Budget' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {product.budgetSuitability}
                    </Badge>
                  </div>

                  {/* Why this ranked here */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
                    <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                      Why it ranked #{product.rank}:
                    </p>
                    <p className="text-slate-600 leading-relaxed">{product.rankReason}</p>

                    {/* Key match highlights */}
                    <div className="space-y-1 pt-1">
                      {(product.matchHighlights || []).map((hl, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score Breakdown Bar */}
                  <div className="text-[11px] space-y-1.5 pt-1">
                    <div className="flex justify-between text-slate-500 font-medium">
                      <span>Requirement Match:</span>
                      <span className="font-semibold text-slate-800">{breakdown.requirementMatch || 28}/35</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-blue h-full rounded-full transition-all"
                        style={{ width: `${((breakdown.requirementMatch || 28) / 35) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover rounded-xl shadow-xs transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleSave(product.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      saved
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:bg-slate-50'
                    }`}
                    title={saved ? 'Remove from Saved' : 'Save Product'}
                    aria-label={`Save ${product.name}`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Other Compared Products (for 4 or 5 products compared) */}
      {otherCompared.length > 0 && (
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-content-primary">
                Other Compared Products ({otherCompared.length})
              </h3>
              <p className="text-xs text-content-secondary">
                These products were evaluated in your comparison set but ranked below the top tier for your specified criteria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherCompared.map(product => {
              const saved = isSaved(product.id);

              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      #{product.rank}
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-slate-50 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{product.name}</h4>
                      <p className="text-xs font-bold text-brand-blue">{formatINR(product.price)}</p>
                      <p className="text-[11px] text-slate-500">Score: {product.score}/100 • {product.budgetSuitability}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/product/${product.id}`}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleSave(product.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        saved ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-400 border-slate-200 hover:text-rose-600'
                      }`}
                      aria-label={`Save ${product.name}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
