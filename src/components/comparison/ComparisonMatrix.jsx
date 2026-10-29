import React from 'react';
import { Link } from 'react-router-dom';
import { X, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

export const ComparisonMatrix = ({
  products = [],
  onRemoveProduct,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-content-primary">Detailed Side-by-Side Matrix</h3>
          <p className="text-xs text-content-secondary">
            Scrutinize hardware specifications, key advantages, and trade-offs.
          </p>
        </div>
      </div>

      {/* Desktop / Tablet Scrollable Matrix Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-surface-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          {/* Product Header Row */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 w-48 font-semibold text-slate-500 uppercase tracking-wider text-[11px] align-top">
                Product Details
              </th>
              {products.map(p => (
                <th key={p.id} className="p-4 min-w-[220px] max-w-[280px] align-top border-l border-slate-100">
                  <div className="relative space-y-2">
                    <button
                      type="button"
                      onClick={() => onRemoveProduct(p.id)}
                      className="absolute top-0 right-0 p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                      title="Remove from comparison"
                      aria-label={`Remove ${p.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-24 h-24 object-cover rounded-xl bg-slate-100 border border-slate-200"
                    />

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {p.brand}
                      </span>
                      <Link to={`/product/${p.id}`} className="block hover:text-brand-blue font-semibold text-slate-900 line-clamp-2">
                        {p.name}
                      </Link>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-bold text-slate-900">{formatINR(p.price)}</span>
                      {p.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatINR(p.originalPrice)}
                        </span>
                      )}
                    </div>

                    {p.isBestMatch && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-brand-blue">
                        ★ Best Match (#1)
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* User Rating */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Rating & Reviews</td>
              {products.map(p => (
                <td key={p.id} className="p-4 border-l border-slate-100">
                  <RatingStars rating={p.rating} reviewCount={p.reviewCount} size="sm" />
                </td>
              ))}
            </tr>

            {/* Budget Suitability */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Budget Suitability</td>
              {products.map(p => (
                <td key={p.id} className="p-4 border-l border-slate-100">
                  <Badge
                    variant={p.budgetSuitability === 'Within Budget' || p.budgetSuitability === 'Well Under Budget' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {p.budgetSuitability}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Value for Money */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Value for Money</td>
              {products.map(p => (
                <td key={p.id} className="p-4 border-l border-slate-100 font-medium text-slate-800">
                  {p.valueForMoney}
                </td>
              ))}
            </tr>

            {/* Processor / Core Engine */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Processor / Driver</td>
              {products.map(p => {
                const s = p.specifications || {};
                return (
                  <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700 font-medium">
                    {s.processor || s.driverSize || 'Standard High-Performance'}
                  </td>
                );
              })}
            </tr>

            {/* RAM & Memory */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">RAM / Memory</td>
              {products.map(p => {
                const s = p.specifications || {};
                return (
                  <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                    {s.ram || 'N/A (Audio/Display)'}
                  </td>
                );
              })}
            </tr>

            {/* Battery / Runtime */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Battery Endurance</td>
              {products.map(p => {
                const s = p.specifications || {};
                return (
                  <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                    {s.battery || 'Continuous AC Power'}
                  </td>
                );
              })}
            </tr>

            {/* Display / Panel */}
            <tr>
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">Display Quality</td>
              {products.map(p => {
                const s = p.specifications || {};
                return (
                  <td key={p.id} className="p-4 border-l border-slate-100 text-slate-700">
                    {s.display || 'N/A'}
                  </td>
                );
              })}
            </tr>

            {/* Top Pros */}
            <tr>
              <td className="p-4 font-semibold text-emerald-800 bg-emerald-50/30">Top Advantages</td>
              {products.map(p => (
                <td key={p.id} className="p-4 border-l border-slate-100 space-y-1.5 align-top">
                  {(p.pros || []).map((pro, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Important Cons / Trade-offs */}
            <tr>
              <td className="p-4 font-semibold text-amber-800 bg-amber-50/30">Trade-offs to Consider</td>
              {products.map(p => (
                <td key={p.id} className="p-4 border-l border-slate-100 space-y-1.5 align-top">
                  {(p.cons || []).map((con, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Responsive Cards Layout */}
      <div className="md:hidden space-y-4">
        {products.map(p => {
          const s = p.specifications || {};
          return (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">{p.brand}</span>
                    <Link to={`/product/${p.id}`} className="font-semibold text-xs text-slate-900 block line-clamp-2">
                      {p.name}
                    </Link>
                    <p className="text-sm font-bold text-brand-blue pt-0.5">{formatINR(p.price)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveProduct(p.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                  aria-label={`Remove ${p.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Budget Fit</span>
                  <span className="font-medium text-slate-800">{p.budgetSuitability}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Rating</span>
                  <span className="font-medium text-slate-800">{p.rating}★ ({p.reviewCount})</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Engine / Specs</span>
                  <span className="font-medium text-slate-800">
                    {s.processor || s.driverSize || 'Standard'} • {s.ram || s.battery || 'Optimized'}
                  </span>
                </div>
              </div>

              {p.pros && p.pros.length > 0 && (
                <div className="pt-2 text-xs space-y-1">
                  <p className="font-semibold text-emerald-700">Top Pro:</p>
                  <p className="text-slate-600 text-[11px]">{p.pros[0]}</p>
                </div>
              )}
              {p.cons && p.cons.length > 0 && (
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-amber-700">Trade-off:</p>
                  <p className="text-slate-600 text-[11px]">{p.cons[0]}</p>
                </div>
              )}

              <Link
                to={`/product/${p.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                <span>View Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
